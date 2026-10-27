import { thaiBuddhistYear } from "@/lib/format";

export type AboutContent = {
  name: string;
  hero: { description: string };
  vision: string;
  missions: string[];
  benefits: { title: string; description: string }[];
  stats: {
    /** Founding year in Buddhist Era (พ.ศ.), e.g. 2560 */
    foundedYear: number;
    courses: number;
    learners: number;
    certificates: number;
    /** Date the numbers above were taken, YYYY-MM-DD (ค.ศ.) */
    asOf: string;
  };
  contact: {
    address: string;
    /** Digits only, formatted for display by formatThaiPhone */
    phone: string;
    email: string;
    hours: string;
  };
};

export const HERO_DESCRIPTION_MAX = 120;
export const BENEFIT_DESCRIPTION_MAX = 200;
export const BENEFIT_COUNT = 3;
export const MISSIONS_MIN = 1;
export const MISSIONS_MAX = 5;

export class AboutContentError extends Error {
  constructor(readonly issues: string[]) {
    super(`Invalid about content:\n- ${issues.join("\n- ")}`);
    this.name = "AboutContentError";
  }
}

// Count user-perceived characters by code point so Thai vowels/tone marks match an editor's count.
const length = (value: string) => [...value.trim()].length;

const isIsoDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
};

/**
 * Validates hand-edited about content (AB-05). Throws AboutContentError listing every
 * problem, so a bad edit fails tests and the build instead of rendering wrong.
 */
export function parseAboutContent(content: AboutContent): AboutContent {
  const issues: string[] = [];
  const check = (ok: boolean, issue: string) => {
    if (!ok) issues.push(issue);
  };
  const text = (value: string, field: string, max?: number) => {
    check(length(value) > 0, `${field} must not be empty`);
    if (max !== undefined) {
      check(length(value) <= max, `${field} must be at most ${max} characters`);
    }
  };
  const count = (value: number, field: string) =>
    check(Number.isSafeInteger(value) && value >= 0, `${field} must be a whole number ≥ 0`);

  text(content.name, "name");
  text(content.hero.description, "hero.description", HERO_DESCRIPTION_MAX);
  text(content.vision, "vision");

  check(
    content.missions.length >= MISSIONS_MIN && content.missions.length <= MISSIONS_MAX,
    `missions must have ${MISSIONS_MIN}–${MISSIONS_MAX} items`,
  );
  content.missions.forEach((mission, i) => text(mission, `missions[${i}]`));

  check(
    content.benefits.length === BENEFIT_COUNT,
    `benefits must have exactly ${BENEFIT_COUNT} cards`,
  );
  content.benefits.forEach((benefit, i) => {
    text(benefit.title, `benefits[${i}].title`);
    text(benefit.description, `benefits[${i}].description`, BENEFIT_DESCRIPTION_MAX);
  });

  const { stats, contact } = content;
  // A Gregorian year such as 2017 is the likely mistake; Buddhist Era years are ~2400+.
  check(
    Number.isInteger(stats.foundedYear) && stats.foundedYear >= 2400 && stats.foundedYear <= 2700,
    "stats.foundedYear must be a Buddhist Era year (พ.ศ.), e.g. 2560",
  );
  count(stats.courses, "stats.courses");
  count(stats.learners, "stats.learners");
  count(stats.certificates, "stats.certificates");
  check(isIsoDate(stats.asOf), "stats.asOf must be a real date in YYYY-MM-DD format");

  text(contact.address, "contact.address");
  check(
    /^0\d{8,9}$/.test(contact.phone),
    "contact.phone must be 9–10 digits starting with 0, without dashes or spaces",
  );
  check(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email), "contact.email must be a valid email");
  text(contact.hours, "contact.hours");

  if (issues.length > 0) throw new AboutContentError(issues);
  return content;
}

/** AB-03: current Buddhist Era year in Thai time minus the founding year, never below 0 */
export function yearsInOperation(foundedYear: number, now: Date) {
  return Math.max(0, thaiBuddhistYear(now) - foundedYear);
}
