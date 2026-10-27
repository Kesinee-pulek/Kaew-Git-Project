"use server";

import { redirect } from "next/navigation";
import { PDPA_POLICY_VERSION } from "@/content/member";
import {
  safeNextPath,
  validateRegistration,
  type MemberType,
  type RegisterErrors,
  type RegisterInput,
} from "@/lib/auth/validation";
import { createClient } from "@/lib/supabase/server";

export type RegisterValues = Omit<RegisterInput, "password" | "confirmPassword">;

export type RegisterState = {
  errors: RegisterErrors;
  /** Set when the failure is not tied to one field. */
  formError?: string;
  /** Kept after an error so the member does not retype them (AU-16). Passwords are never returned. */
  values: RegisterValues;
};

const TAKEN_EMAIL = "อีเมลนี้ถูกใช้แล้ว";
const TAKEN_EMPLOYEE_ID = "รหัสพนักงานนี้ถูกใช้แล้ว";

const field = (formData: FormData, name: string) => {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
};

function readValues(formData: FormData): RegisterValues {
  return {
    memberType: field(formData, "memberType") as MemberType | "",
    fullName: field(formData, "fullName"),
    email: field(formData, "email"),
    employeeId: field(formData, "employeeId"),
    affiliation: field(formData, "affiliation"),
    privacyAccepted: formData.get("privacyAccepted") === "on",
  };
}

/**
 * Which of the employee ID / email values are already taken (BR-02, BR-04). Used both as a
 * pre-check and after a failed sign-up, so a race that the trigger caught still shows the
 * matching field error (AU-10).
 */
async function findTaken(email: string, employeeId: string | null): Promise<RegisterErrors> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("registration_conflicts", {
    p_email: email,
    p_employee_id: employeeId,
  });
  if (error || !data) return {};

  const taken: RegisterErrors = {};
  if (data.email_taken) taken.email = TAKEN_EMAIL;
  if (data.employee_id_taken) taken.employeeId = TAKEN_EMPLOYEE_ID;
  return taken;
}

export async function registerAction(
  _previous: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const values = readValues(formData);
  const next = safeNextPath(field(formData, "next"));
  const password = field(formData, "password");
  const confirmPassword = field(formData, "confirmPassword");

  const result = validateRegistration({ ...values, password, confirmPassword });
  if (!result.ok) return { errors: result.errors, values };

  const { value } = result;
  const taken = await findTaken(value.email, value.employeeId);
  if (Object.keys(taken).length > 0) return { errors: taken, values };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: value.email,
    password: value.password,
    options: {
      // The database trigger copies these into public.profiles and always sets role = LEARNER (AU-09).
      data: {
        full_name: value.fullName,
        member_type: value.memberType,
        employee_id: value.employeeId,
        affiliation: value.affiliation,
        pdpa_version: PDPA_POLICY_VERSION,
      },
    },
  });

  if (error) {
    if (error.code === "user_already_exists") return { errors: { email: TAKEN_EMAIL }, values };
    const raced = await findTaken(value.email, value.employeeId);
    if (Object.keys(raced).length > 0) return { errors: raced, values };
    return { errors: {}, formError: "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง", values };
  }

  // AU-11: the account must be signed in straight away. Without a session, email confirmation is still on.
  if (!data.session) {
    return {
      errors: {},
      formError: "ยังเข้าสู่ระบบทันทีไม่ได้ กรุณาติดต่อผู้ดูแลระบบ",
      values,
    };
  }

  redirect(next);
}
