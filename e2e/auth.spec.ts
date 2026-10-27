import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// These tests only cover paths that fail validation before any Supabase call, so they run
// without a database. Full sign-up and sign-in flows need the migration applied to a project.

const fillPublicRegistration = async (page: Page, overrides: Record<string, string> = {}) => {
  const values = {
    fullName: "สมศรี ใจดี",
    email: "somsri@example.com",
    password: "password1",
    confirmPassword: "password1",
    ...overrides,
  };
  await page.getByLabel("บุคคลภายนอก").check();
  await page.getByLabel("ชื่อ-นามสกุล").fill(values.fullName);
  await page.getByLabel("อีเมล").fill(values.email);
  await page.getByLabel("รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)").fill(values.password);
  await page.getByLabel("ยืนยันรหัสผ่าน").fill(values.confirmPassword);
};

test.describe("/register", () => {
  test("AS-07 hides employee fields for a public member", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel("พนักงาน กฟภ.").check();
    await expect(page.getByLabel("รหัสพนักงาน")).toBeVisible();
    await expect(page.getByLabel("สังกัด")).toBeVisible();

    await page.getByLabel("บุคคลภายนอก").check();
    await expect(page.getByLabel("รหัสพนักงาน")).toHaveCount(0);
    await expect(page.getByLabel("สังกัด")).toHaveCount(0);
  });

  test("AS-05 shows the mismatch error under the confirm field", async ({ page }) => {
    await page.goto("/register");
    await fillPublicRegistration(page, { confirmPassword: "password12" });
    await page.getByLabel("ยอมรับ").check();
    await page.getByRole("button", { name: "สมัครสมาชิก" }).click();

    const confirm = page.getByLabel("ยืนยันรหัสผ่าน");
    await expect(page.locator("#confirmPassword-error")).toHaveText("รหัสผ่านไม่ตรงกัน");
    await expect(confirm).toHaveAttribute("aria-invalid", "true");
    await expect(confirm).toHaveAttribute("aria-describedby", "confirmPassword-error");
  });

  test("AS-08 requires the privacy policy", async ({ page }) => {
    await page.goto("/register");
    await fillPublicRegistration(page);
    await page.getByRole("button", { name: "สมัครสมาชิก" }).click();
    await expect(page.locator('form [role="alert"]')).toHaveCount(0);
    await expect(page.locator("#privacyAccepted-error")).toHaveText(
      "กรุณายอมรับนโยบายคุ้มครองข้อมูลส่วนบุคคล",
    );
  });

  test("AS-09 keeps entered values and clears passwords after an error", async ({ page }) => {
    await page.goto("/register");
    await fillPublicRegistration(page, { confirmPassword: "different1" });
    await page.getByRole("button", { name: "สมัครสมาชิก" }).click();
    await expect(page.locator("#confirmPassword-error")).toBeVisible();

    await expect(page.getByLabel("ชื่อ-นามสกุล")).toHaveValue("สมศรี ใจดี");
    await expect(page.getByLabel("อีเมล")).toHaveValue("somsri@example.com");
    await expect(page.getByLabel("บุคคลภายนอก")).toBeChecked();
    await expect(page.getByLabel("รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)")).toHaveValue("");
    await expect(page.getByLabel("ยืนยันรหัสผ่าน")).toHaveValue("");
  });

  test("AU-15 carries a safe next path into the sign-in link", async ({ page }) => {
    await page.goto("/register?next=/courses/SAF-101");
    await expect(page.locator("main").getByRole("link", { name: "เข้าสู่ระบบ" })).toHaveAttribute(
      "href",
      "/login?next=%2Fcourses%2FSAF-101",
    );
  });

  test("AU-15 replaces an unsafe next path with /", async ({ page }) => {
    await page.goto("/register?next=//evil.example");
    await expect(page.locator("main").getByRole("link", { name: "เข้าสู่ระบบ" })).toHaveAttribute(
      "href",
      "/login?next=%2F",
    );
  });

  test("AS-18 has no serious or critical axe violations", async ({ page }) => {
    await page.goto("/register");
    const { violations } = await new AxeBuilder({ page }).analyze();
    const blocking = violations
      .filter((v) => v.impact === "serious" || v.impact === "critical")
      .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
    expect(blocking).toEqual([]);
  });

  test("AS-18 fits a 375px screen", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/register");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
});

test.describe("/login", () => {
  test("shows the empty-field message when a field is missing", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: "เข้าสู่ระบบ" }).click();
    await expect(page.locator('form [role="alert"]')).toHaveText("กรุณากรอกอีเมลและรหัสผ่าน");
  });

  test("AU-15 keeps a safe next path in the hidden field", async ({ page }) => {
    await page.goto(`/login?next=${encodeURIComponent("/courses?q=saf&page=2")}`);
    await expect(page.locator('input[name="next"]')).toHaveValue("/courses?q=saf&page=2");
  });

  test("AU-15 replaces an external next path with /", async ({ page }) => {
    await page.goto("/login?next=https://evil.example");
    await expect(page.locator('input[name="next"]')).toHaveValue("/");
  });

  test("AS-18 has no serious or critical axe violations", async ({ page }) => {
    await page.goto("/login");
    const { violations } = await new AxeBuilder({ page }).analyze();
    const blocking = violations
      .filter((v) => v.impact === "serious" || v.impact === "critical")
      .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
    expect(blocking).toEqual([]);
  });
});

test.describe("header account links", () => {
  test("offers sign-in and sign-up when signed out", async ({ page }) => {
    await page.goto("/");
    // The desktop and mobile variants both exist in the DOM; only the visible one is checked.
    await expect(
      page.locator("header").getByRole("link", { name: "สมัครสมาชิก" }).filter({ visible: true }),
    ).toHaveCount(1);
    await expect(
      page.locator("header").getByRole("link", { name: "เข้าสู่ระบบ" }).filter({ visible: true }),
    ).toHaveCount(1);
  });
});
