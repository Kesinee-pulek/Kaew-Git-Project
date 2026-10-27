"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/login/actions";

const initialState: LoginState = { email: "", next: "/" };

export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(loginAction, { ...initialState, next });

  return (
    <form action={action} className="mt-8 space-y-5" noValidate>
      <input type="hidden" name="next" value={next} />

      {state.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium">อีเมล</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.email}
          required
          className="mt-1 h-11 w-full rounded-lg border border-black/15 bg-background px-3 dark:border-white/20"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">รหัสผ่าน</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1 h-11 w-full rounded-lg border border-black/15 bg-background px-3 dark:border-white/20"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-full bg-brand font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-60"
      >
        {pending ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
      </button>

      <p className="text-center text-sm text-foreground/70">
        ยังไม่มีบัญชี?{" "}
        <Link href={`/register?next=${encodeURIComponent(next)}`} className="font-medium text-brand hover:underline">
          สมัครสมาชิก
        </Link>
      </p>
    </form>
  );
}
