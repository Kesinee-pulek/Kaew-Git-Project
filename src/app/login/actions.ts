"use server";

import { redirect } from "next/navigation";
import {
  LOGIN_INVALID_MESSAGE,
  lockedMessage,
  minutesUntil,
  normalizeEmail,
  safeNextPath,
} from "@/lib/auth/validation";
import { createClient } from "@/lib/supabase/server";

export type LoginState = {
  error?: string;
  /** Kept after an error; the password is never returned (AU-16). */
  email: string;
  next: string;
};

const EMPTY_FIELDS = "กรุณากรอกอีเมลและรหัสผ่าน";
const UNAVAILABLE = "ระบบเข้าสู่ระบบขัดข้อง กรุณาลองใหม่อีกครั้ง";

const field = (formData: FormData, name: string) => {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
};

export async function loginAction(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const rawEmail = field(formData, "email");
  const password = field(formData, "password");
  const next = safeNextPath(field(formData, "next"));
  const state = { email: rawEmail, next };

  const email = normalizeEmail(rawEmail);
  if (email.length === 0 || password.length === 0) {
    return { ...state, error: EMPTY_FIELDS };
  }

  const supabase = await createClient();

  // AU-13: a locked account is refused before the password is checked, even if it is correct.
  const lock = await supabase.rpc("login_lock_status", { p_email: email });
  if (lock.error) return { ...state, error: UNAVAILABLE };
  if (lock.data) {
    return { ...state, error: lockedMessage(minutesUntil(new Date(lock.data), new Date())) };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // AU-12: failures look identical whether the email is unknown or the password is wrong.
    const failure = await supabase.rpc("login_record_failure", { p_email: email });
    if (failure.error) return { ...state, error: UNAVAILABLE };
    if (failure.data) {
      return { ...state, error: lockedMessage(minutesUntil(new Date(failure.data), new Date())) };
    }
    return { ...state, error: LOGIN_INVALID_MESSAGE };
  }

  // AU-14: a successful login resets the failure counter. The DB function clears only the caller's own row.
  await supabase.rpc("login_clear_failures");
  redirect(next);
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
