import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { aboutContent } from "../src/content/about";
import { formatNumber, formatThaiDate, formatThaiPhone } from "../src/lib/format";

const { contact, stats } = aboutContent;

test.describe("/about", () => {
  test("AS-01 opens with a single h1", async ({ page }) => {
    const response = await page.goto("/about");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText("ศูนย์อบรมออนไลน์ การไฟฟ้าส่วนภูมิภาค");
  });

  test("AS-02 has the 5 sections in order", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("main h2")).toHaveText([
      "พันธกิจและวิสัยทัศน์",
      "สิ่งที่ผู้เรียนได้รับ",
      "ผลการดำเนินงาน",
      "ติดต่อเรา",
    ]);
    await expect(page.getByTestId("benefit-card")).toHaveCount(3);
  });

  test("AS-03 links to the course list", async ({ page }) => {
    await page.goto("/about");
    await page.getByRole("link", { name: "ดูหลักสูตรทั้งหมด" }).click();
    await expect(page).toHaveURL("/courses");
  });

  test("AS-04 formats numbers and the as-of date", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByTestId("stat-courses")).toHaveText(formatNumber(stats.courses));
    await expect(page.getByTestId("stat-learners")).toHaveText(formatNumber(stats.learners));
    await expect(page.getByTestId("stat-certificates")).toHaveText(
      formatNumber(stats.certificates),
    );
    await expect(page.getByTestId("stats-as-of")).toHaveText(
      `ข้อมูล ณ ${formatThaiDate(stats.asOf)}`,
    );
    await expect(page.getByTestId("stat-years")).toHaveText(/^\d+$/);
  });

  test("AS-06 phone and email are one click away", async ({ page }) => {
    await page.goto("/about");
    const section = page.getByTestId("about-contact");
    await expect(section.getByRole("link", { name: formatThaiPhone(contact.phone) })).toHaveAttribute(
      "href",
      `tel:${contact.phone}`,
    );
    await expect(section.getByRole("link", { name: contact.email })).toHaveAttribute(
      "href",
      `mailto:${contact.email}`,
    );
  });

  test("AS-07 sets title and description", async ({ page }) => {
    await page.goto("/about");
    await expect(page).toHaveTitle("เกี่ยวกับเรา | ศูนย์อบรมออนไลน์ กฟภ.");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      aboutContent.hero.description,
    );
  });

  test("AS-08 main menu marks เกี่ยวกับเรา as current only on /about", async ({ page }) => {
    const aboutLink = () =>
      page.getByRole("navigation", { name: "เมนูหลัก", exact: true }).getByRole("link", { name: "เกี่ยวกับเรา" });

    await page.goto("/");
    await expect(aboutLink()).toHaveAttribute("href", "/about");
    await expect(aboutLink()).not.toHaveAttribute("aria-current");

    await aboutLink().click();
    await expect(page).toHaveURL("/about");
    await expect(aboutLink()).toHaveAttribute("aria-current", "page");
  });

  test("AS-09 has no serious or critical axe violations", async ({ page }) => {
    await page.goto("/about");
    const { violations } = await new AxeBuilder({ page }).analyze();
    const blocking = violations
      .filter((v) => v.impact === "serious" || v.impact === "critical")
      .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
    expect(blocking).toEqual([]);
  });

  test("AS-10 fits a 375px screen with cards stacked", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/about");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);

    const boxes = await page.getByTestId("benefit-card").evaluateAll((cards) =>
      cards.map((card) => card.getBoundingClientRect().toJSON() as DOMRect),
    );
    expect(boxes).toHaveLength(3);
    for (let i = 1; i < boxes.length; i++) {
      expect(boxes[i].left).toBe(boxes[0].left);
      expect(boxes[i].top).toBeGreaterThanOrEqual(boxes[i - 1].bottom);
    }
  });
});
