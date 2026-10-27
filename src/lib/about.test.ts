import { describe, expect, it } from "vitest";
import { aboutContent } from "@/content/about";
import { parseAboutContent, yearsInOperation, type AboutContent } from "@/lib/about";
import { formatNumber, formatThaiDate, formatThaiPhone } from "@/lib/format";

const withChange = (change: (draft: AboutContent) => void) => {
  const draft = structuredClone(aboutContent);
  change(draft);
  return () => parseAboutContent(draft);
};

describe("about content file (AB-05)", () => {
  it("ships valid content", () => {
    expect(() => parseAboutContent(aboutContent)).not.toThrow();
  });

  // AS-11
  it.each([
    ["email without domain", (d: AboutContent) => { d.contact.email = "training@"; }, /contact\.email/],
    ["phone with dashes", (d: AboutContent) => { d.contact.phone = "02-589-9000"; }, /contact\.phone/],
    ["negative learners", (d: AboutContent) => { d.stats.learners = -1; }, /stats\.learners/],
    ["Gregorian founding year", (d: AboutContent) => { d.stats.foundedYear = 2017; }, /stats\.foundedYear/],
    ["only 2 benefit cards", (d: AboutContent) => { d.benefits.pop(); }, /benefits must have exactly 3/],
    ["Thai-style asOf date", (d: AboutContent) => { d.stats.asOf = "30/09/2569"; }, /stats\.asOf/],
    ["impossible asOf date", (d: AboutContent) => { d.stats.asOf = "2026-02-30"; }, /stats\.asOf/],
    ["hero description over 120 characters", (d: AboutContent) => { d.hero.description = "ก".repeat(121); }, /hero\.description/],
    ["benefit description over 200 characters", (d: AboutContent) => { d.benefits[0].description = "ก".repeat(201); }, /benefits\[0\]\.description/],
    ["no missions", (d: AboutContent) => { d.missions = []; }, /missions must have 1–5/],
    ["6 missions", (d: AboutContent) => { d.missions = Array(6).fill("พันธกิจ"); }, /missions must have 1–5/],
  ])("rejects %s", (_label, change, message) => {
    expect(withChange(change)).toThrow(message);
  });

  it("accepts limits exactly at the boundary", () => {
    expect(
      withChange((d) => {
        d.hero.description = "ก".repeat(120);
        d.benefits[0].description = "ก".repeat(200);
        d.missions = Array(5).fill("พันธกิจ");
      }),
    ).not.toThrow();
  });
});

describe("number and date display (AS-04)", () => {
  it.each([
    [12500, "12,500"],
    [48, "48"],
  ])("formats %d as %s", (value, expected) => {
    expect(formatNumber(value)).toBe(expected);
  });

  it("shows asOf as a Thai Buddhist Era date", () => {
    expect(formatThaiDate("2026-09-30")).toBe("30 กันยายน 2569");
  });
});

describe("yearsInOperation (AS-05)", () => {
  it.each([
    [2560, "2026-10-27T10:00:00+07:00", 9],
    [2560, "2026-12-31T23:59:59.999+07:00", 9],
    [2560, "2026-12-31T17:00:00.000Z", 10],
    [2569, "2026-10-27T10:00:00+07:00", 0],
    [2570, "2026-10-27T10:00:00+07:00", 0],
  ])("founded %d at %s → %d years", (foundedYear, now, expected) => {
    expect(yearsInOperation(foundedYear, new Date(now))).toBe(expected);
  });
});

describe("formatThaiPhone (AS-06)", () => {
  it.each([
    ["021234567", "02-123-4567"],
    ["053123456", "053-123-456"],
    ["0812345678", "081-234-5678"],
  ])("formats %s as %s", (digits, expected) => {
    expect(formatThaiPhone(digits)).toBe(expected);
  });
});
