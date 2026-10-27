import { AFFILIATIONS } from "@/content/member";

export const NAME_MIN = 2;
export const NAME_MAX = 100;
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 128;
export const EMPLOYEE_ID_PATTERN = /^\d{6}$/;
export const PEA_EMAIL_DOMAIN = "@pea.co.th";

export type MemberType = "EMPLOYEE" | "PUBLIC";

export type RegisterInput = {
  memberType: MemberType | "";
  fullName: string;
  email: string;
  employeeId: string;
  affiliation: string;
  password: string;
  confirmPassword: string;
  privacyAccepted: boolean;
};

export type RegisterErrors = Partial<Record<keyof RegisterInput, string>>;

export type ValidRegistration = {
  memberType: MemberType;
  fullName: string;
  email: string;
  employeeId: string | null;
  affiliation: string | null;
  password: string;
};

type Result = { ok: true; value: ValidRegistration } | { ok: false; errors: RegisterErrors };

// Count user-perceived characters by code point so Thai vowels and tone marks count as an editor would.
const length = (value: string) => [...value].length;

/** AU-02: trim surrounding spaces and lowercase, so the stored email is the canonical form. */
export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

/** AU-06: must be exactly `@pea.co.th`, not a subdomain. */
export function isPeaEmail(normalizedEmail: string) {
  if (!normalizedEmail.endsWith(PEA_EMAIL_DOMAIN)) return false;
  const localPart = normalizedEmail.slice(0, -PEA_EMAIL_DOMAIN.length);
  return localPart.length > 0 && !localPart.includes("@");
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates the registration form (AU-01 – AU-08). Returns every field error at once
 * (AS-09 expects all problems shown together), and only the fields that apply to the
 * chosen member type are kept on success (AU-07).
 */
export function validateRegistration(input: RegisterInput): Result {
  const errors: RegisterErrors = {};

  const memberType = input.memberType;
  if (memberType !== "EMPLOYEE" && memberType !== "PUBLIC") {
    errors.memberType = "กรุณาเลือกประเภทผู้สมัคร";
  }

  const fullName = input.fullName.trim();
  if (length(fullName) < NAME_MIN || length(fullName) > NAME_MAX) {
    errors.fullName = `ชื่อ-นามสกุลต้องมี ${NAME_MIN}–${NAME_MAX} ตัวอักษร`;
  }

  const email = normalizeEmail(input.email);
  if (!EMAIL_PATTERN.test(email)) {
    errors.email = "รูปแบบอีเมลไม่ถูกต้อง";
  }

  const employeeId = input.employeeId.trim();
  const affiliation = input.affiliation.trim();
  if (memberType === "EMPLOYEE") {
    if (!isPeaEmail(email) && !errors.email) {
      errors.email = "พนักงานต้องใช้อีเมล @pea.co.th";
    }
    if (!EMPLOYEE_ID_PATTERN.test(employeeId)) {
      errors.employeeId = "รหัสพนักงานต้องเป็นตัวเลข 6 หลัก";
    }
    if (!(AFFILIATIONS as readonly string[]).includes(affiliation)) {
      errors.affiliation = "กรุณาเลือกสังกัด";
    }
  }

  const { password, confirmPassword } = input;
  if (length(password) < PASSWORD_MIN) {
    errors.password = `รหัสผ่านต้องมีอย่างน้อย ${PASSWORD_MIN} ตัวอักษร`;
  } else if (length(password) > PASSWORD_MAX) {
    errors.password = `รหัสผ่านยาวได้ไม่เกิน ${PASSWORD_MAX} ตัวอักษร`;
  }
  if (password !== confirmPassword) {
    errors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
  }

  if (!input.privacyAccepted) {
    errors.privacyAccepted = "กรุณายอมรับนโยบายคุ้มครองข้อมูลส่วนบุคคล";
  }

  if (Object.keys(errors).length > 0 || (memberType !== "EMPLOYEE" && memberType !== "PUBLIC")) {
    return { ok: false, errors };
  }

  const isEmployee = memberType === "EMPLOYEE";
  return {
    ok: true,
    value: {
      memberType,
      fullName,
      email,
      employeeId: isEmployee ? employeeId : null,
      affiliation: isEmployee ? affiliation : null,
      password,
    },
  };
}

/**
 * AU-15: only same-site paths may be used after login. Anything that could leave the site
 * (`//host`, `/\host`, absolute URLs, `javascript:`) or loops back to an auth page falls back to `/`.
 */
export function safeNextPath(next: string | null | undefined) {
  if (!next || !next.startsWith("/")) return "/";
  if (next.startsWith("//") || next.startsWith("/\\")) return "/";
  if (next === "/login" || next.startsWith("/login?") || next.startsWith("/login/")) return "/";
  if (next === "/register" || next.startsWith("/register?") || next.startsWith("/register/")) return "/";
  return next;
}

/** AS-13: remaining lock time shown to the user, rounded up to whole minutes. */
export function minutesUntil(lockedUntil: Date, now: Date) {
  const ms = lockedUntil.getTime() - now.getTime();
  return Math.max(1, Math.ceil(ms / 60_000));
}

export const LOGIN_INVALID_MESSAGE = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
export const lockedMessage = (minutes: number) =>
  `บัญชีถูกล็อกชั่วคราว ลองใหม่ได้ในอีก ${minutes} นาที`;
