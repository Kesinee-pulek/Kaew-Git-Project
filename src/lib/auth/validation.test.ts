import { describe, expect, it } from "vitest";
import { AFFILIATIONS } from "@/content/member";
import {
  minutesUntil,
  normalizeEmail,
  safeNextPath,
  validateRegistration,
  type RegisterInput,
} from "@/lib/auth/validation";

const base: RegisterInput = {
  memberType: "PUBLIC",
  fullName: "สมศรี ใจดี",
  email: "somsri@example.com",
  employeeId: "",
  affiliation: "",
  password: "password1",
  confirmPassword: "password1",
  privacyAccepted: true,
};

const employee: RegisterInput = {
  ...base,
  memberType: "EMPLOYEE",
  email: "somchai@pea.co.th",
  employeeId: "012345",
  affiliation: AFFILIATIONS[0],
};

const withChange = (change: Partial<RegisterInput>) => validateRegistration({ ...base, ...change });
const employeeWith = (change: Partial<RegisterInput>) =>
  validateRegistration({ ...employee, ...change });

describe("AS-01 public registration", () => {
  it("accepts a valid public registration and keeps only name, email, password", () => {
    const result = validateRegistration({
      ...base,
      employeeId: "999999",
      affiliation: "ไม่ควรถูกบันทึก",
    });
    expect(result).toEqual({
      ok: true,
      value: {
        memberType: "PUBLIC",
        fullName: "สมศรี ใจดี",
        email: "somsri@example.com",
        employeeId: null,
        affiliation: null,
        password: "password1",
      },
    });
  });
});

describe("AS-02 employee registration", () => {
  it("accepts a valid employee registration with ID and affiliation", () => {
    const result = validateRegistration(employee);
    expect(result).toMatchObject({
      ok: true,
      value: { memberType: "EMPLOYEE", employeeId: "012345", affiliation: AFFILIATIONS[0] },
    });
  });
});

describe("AS-03 name length (AU-01)", () => {
  it.each([
    ["ก", false],
    ["   ", false],
    ["  กข  ", true],
    ["ก".repeat(100), true],
    ["ก".repeat(101), false],
  ])("name %j valid=%s", (fullName, valid) => {
    expect(withChange({ fullName }).ok).toBe(valid);
  });

  it("stores the trimmed name", () => {
    const result = withChange({ fullName: "  กข  " });
    expect(result.ok && result.value.fullName).toBe("กข");
  });

  it("counts Thai vowels and tone marks as characters", () => {
    expect(withChange({ fullName: "ณี" }).ok).toBe(true);
  });
});

describe("AS-04 email (AU-02)", () => {
  it("rejects a malformed email", () => {
    const result = withChange({ email: "somchai@" });
    expect(!result.ok && result.errors.email).toBe("รูปแบบอีเมลไม่ถูกต้อง");
  });

  it("normalizes case and surrounding spaces", () => {
    expect(normalizeEmail("  Somchai@Example.COM  ")).toBe("somchai@example.com");
    const result = withChange({ email: "  Somchai@Example.COM  " });
    expect(result.ok && result.value.email).toBe("somchai@example.com");
  });
});

describe("AS-05 password (AU-03)", () => {
  it.each([
    ["pass123", "pass123", "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"],
    ["ก".repeat(129), "ก".repeat(129), "รหัสผ่านยาวได้ไม่เกิน 128 ตัวอักษร"],
    ["pass1234", "pass12345", "รหัสผ่านไม่ตรงกัน"],
    ["pass1234 ", "pass1234", "รหัสผ่านไม่ตรงกัน"],
  ])("password %j / confirm %j → %s", (password, confirmPassword, message) => {
    const result = withChange({ password, confirmPassword });
    const errors = result.ok ? {} : result.errors;
    expect(Object.values(errors)).toContain(message);
  });

  it("accepts exactly 8 and exactly 128 characters", () => {
    expect(withChange({ password: "pass1234", confirmPassword: "pass1234" }).ok).toBe(true);
    const max = "ก".repeat(128);
    expect(withChange({ password: max, confirmPassword: max }).ok).toBe(true);
  });

  it("does not trim spaces inside the password", () => {
    const result = withChange({ password: "pass1234 ", confirmPassword: "pass1234 " });
    expect(result.ok && result.value.password).toBe("pass1234 ");
  });
});

describe("AS-06 employee data (AU-05, AU-06)", () => {
  it.each([
    ["12345", "รหัสพนักงานต้องเป็นตัวเลข 6 หลัก"],
    ["1234567", "รหัสพนักงานต้องเป็นตัวเลข 6 หลัก"],
    ["12345A", "รหัสพนักงานต้องเป็นตัวเลข 6 หลัก"],
  ])("employee ID %j → %s", (employeeId, message) => {
    const result = employeeWith({ employeeId });
    expect(!result.ok && result.errors.employeeId).toBe(message);
  });

  it("keeps a leading zero as text", () => {
    const result = employeeWith({ employeeId: "012345" });
    expect(result.ok && result.value.employeeId).toBe("012345");
  });

  it.each(["", "ไม่มีในรายการ"])("requires an affiliation from the list (%j)", (affiliation) => {
    const result = employeeWith({ affiliation });
    expect(!result.ok && result.errors.affiliation).toBe("กรุณาเลือกสังกัด");
  });

  it.each([
    "somchai@gmail.com",
    "somchai@mail.pea.co.th",
  ])("rejects non-PEA email %s", (email) => {
    const result = employeeWith({ email });
    expect(!result.ok && result.errors.email).toBe("พนักงานต้องใช้อีเมล @pea.co.th");
  });

  it("accepts PEA email in any case", () => {
    const result = employeeWith({ email: "Somchai@PEA.CO.TH" });
    expect(result.ok && result.value.email).toBe("somchai@pea.co.th");
  });
});

describe("AS-07 public member has no employee data (AU-07)", () => {
  it("does not require or store employee ID and affiliation", () => {
    const result = withChange({ employeeId: "", affiliation: "" });
    expect(result.ok).toBe(true);
  });

  it("does not store them even when sent", () => {
    const result = withChange({ employeeId: "012345", affiliation: "สำนักงาน" });
    expect(result.ok && { employeeId: result.value.employeeId, affiliation: result.value.affiliation }).toEqual({
      employeeId: null,
      affiliation: null,
    });
  });

  it("allows a public member to use a @pea.co.th address", () => {
    expect(withChange({ email: "somchai@pea.co.th" }).ok).toBe(true);
  });
});

describe("AU-04 member type and AU-08 consent", () => {
  it("requires a member type", () => {
    const result = withChange({ memberType: "" });
    expect(!result.ok && result.errors.memberType).toBe("กรุณาเลือกประเภทผู้สมัคร");
  });

  it("requires consent to the privacy policy", () => {
    const result = withChange({ privacyAccepted: false });
    expect(!result.ok && result.errors.privacyAccepted).toBe(
      "กรุณายอมรับนโยบายคุ้มครองข้อมูลส่วนบุคคล",
    );
  });

  it("returns every field error at once (AS-09)", () => {
    const result = validateRegistration({
      ...base,
      memberType: "EMPLOYEE",
      email: "x@gmail.com",
      employeeId: "1",
      affiliation: "",
      password: "short",
      confirmPassword: "other",
      privacyAccepted: false,
    });
    expect(!result.ok && Object.keys(result.errors).sort()).toEqual(
      ["affiliation", "confirmPassword", "email", "employeeId", "password", "privacyAccepted"].sort(),
    );
  });
});

describe("AU-15 safeNextPath", () => {
  it.each([
    ["/courses/SAF-101", "/courses/SAF-101"],
    ["/courses?q=saf&page=2", "/courses?q=saf&page=2"],
    [null, "/"],
    [undefined, "/"],
    ["", "/"],
    ["https://evil.example", "/"],
    ["//evil.example", "/"],
    ["/\\evil.example", "/"],
    ["javascript:alert(1)", "/"],
    ["courses/SAF-101", "/"],
    ["/login", "/"],
    ["/register", "/"],
    ["/login?next=/courses", "/"],
  ])("next %j → %s", (next, expected) => {
    expect(safeNextPath(next)).toBe(expected);
  });
});

describe("AS-13 remaining lock time", () => {
  const now = new Date("2026-10-27T10:10:30+07:00");

  it.each([
    ["2026-10-27T10:19:30+07:00", 9],
    ["2026-10-27T10:15:30+07:00", 5],
    ["2026-10-27T10:10:31+07:00", 1],
    ["2026-10-27T10:10:30+07:00", 1],
  ])("locked until %s shows %d minutes", (lockedUntil, expected) => {
    expect(minutesUntil(new Date(lockedUntil), now)).toBe(expected);
  });
});
