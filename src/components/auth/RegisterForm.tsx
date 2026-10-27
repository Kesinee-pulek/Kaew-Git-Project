"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { registerAction, type RegisterState } from "@/app/register/actions";
import { AFFILIATIONS } from "@/content/member";
import type { MemberType } from "@/lib/auth/validation";

const inputClass =
  "mt-1 h-11 w-full rounded-lg border border-black/15 bg-background px-3 dark:border-white/20";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-sm text-red-600 dark:text-red-400">
      {message}
    </p>
  );
}

export default function RegisterForm({ next }: { next: string }) {
  const initialState: RegisterState = {
    errors: {},
    values: {
      memberType: "",
      fullName: "",
      email: "",
      employeeId: "",
      affiliation: "",
      privacyAccepted: false,
    },
  };
  const [state, action, pending] = useActionState(registerAction, initialState);
  const [memberType, setMemberType] = useState<MemberType | "">(state.values.memberType);
  const isEmployee = memberType === "EMPLOYEE";
  const { errors, values } = state;

  return (
    <form action={action} className="mt-8 space-y-6" noValidate>
      <input type="hidden" name="next" value={next} />

      {state.formError && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {state.formError}
        </p>
      )}

      <fieldset aria-describedby={errors.memberType ? "memberType-error" : undefined}>
        <legend className="text-sm font-medium">ประเภทผู้สมัคร</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {[
            { value: "EMPLOYEE", label: "พนักงาน กฟภ." },
            { value: "PUBLIC", label: "บุคคลภายนอก" },
          ].map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-black/15 px-4 py-3 has-[:checked]:border-brand has-[:checked]:bg-brand/5 dark:border-white/20"
            >
              <input
                type="radio"
                name="memberType"
                value={option.value}
                defaultChecked={values.memberType === option.value}
                onChange={() => setMemberType(option.value as MemberType)}
                className="size-4 accent-brand"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        <FieldError id="memberType-error" message={errors.memberType} />
      </fieldset>

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium">ชื่อ-นามสกุล</label>
        <input
          id="fullName"
          name="fullName"
          autoComplete="name"
          defaultValue={values.fullName}
          aria-invalid={errors.fullName ? true : undefined}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
          className={inputClass}
        />
        <FieldError id="fullName-error" message={errors.fullName} />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">อีเมล</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={values.email}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={inputClass}
        />
        <FieldError id="email-error" message={errors.email} />
      </div>

      {isEmployee && (
        <>
          <div>
            <label htmlFor="employeeId" className="block text-sm font-medium">รหัสพนักงาน</label>
            <input
              id="employeeId"
              name="employeeId"
              inputMode="numeric"
              maxLength={6}
              defaultValue={values.employeeId}
              aria-invalid={errors.employeeId ? true : undefined}
              aria-describedby={errors.employeeId ? "employeeId-error" : undefined}
              className={inputClass}
            />
            <FieldError id="employeeId-error" message={errors.employeeId} />
          </div>

          <div>
            <label htmlFor="affiliation" className="block text-sm font-medium">สังกัด</label>
            <select
              id="affiliation"
              name="affiliation"
              defaultValue={values.affiliation}
              aria-invalid={errors.affiliation ? true : undefined}
              aria-describedby={errors.affiliation ? "affiliation-error" : undefined}
              className={inputClass}
            >
              <option value="">เลือกสังกัด</option>
              {AFFILIATIONS.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <FieldError id="affiliation-error" message={errors.affiliation} />
          </div>
        </>
      )}

      <div>
        <label htmlFor="password" className="block text-sm font-medium">รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? "password-error" : undefined}
          className={inputClass}
        />
        <FieldError id="password-error" message={errors.password} />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium">ยืนยันรหัสผ่าน</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={errors.confirmPassword ? true : undefined}
          aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
          className={inputClass}
        />
        <FieldError id="confirmPassword-error" message={errors.confirmPassword} />
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="privacyAccepted"
            defaultChecked={values.privacyAccepted}
            aria-invalid={errors.privacyAccepted ? true : undefined}
            aria-describedby={errors.privacyAccepted ? "privacyAccepted-error" : undefined}
            className="mt-1 size-4 accent-brand"
          />
          <span>
            ยอมรับ{" "}
            <Link href="/privacy" className="font-medium text-brand hover:underline">
              นโยบายคุ้มครองข้อมูลส่วนบุคคล
            </Link>
          </span>
        </label>
        <FieldError id="privacyAccepted-error" message={errors.privacyAccepted} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-full bg-brand font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-60"
      >
        {pending ? "กำลังสมัครสมาชิก…" : "สมัครสมาชิก"}
      </button>

      <p className="text-center text-sm text-foreground/70">
        มีบัญชีแล้ว?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-medium text-brand hover:underline">
          เข้าสู่ระบบ
        </Link>
      </p>
    </form>
  );
}
