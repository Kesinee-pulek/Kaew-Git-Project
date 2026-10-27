export type NavLink = { href: string; label: string };

// Home sections are linked as "/#id" so they also work from other pages.
// "#contact" points at the footer, which every page renders.
export const navLinks: NavLink[] = [
  { href: "/#stats", label: "ผลการดำเนินงาน" },
  { href: "/#categories", label: "หมวดหลักสูตร" },
  { href: "/#courses", label: "หลักสูตรยอดนิยม" },
  { href: "/#how", label: "ขั้นตอนการเรียน" },
  { href: "/about", label: "เกี่ยวกับเรา" },
  { href: "#contact", label: "ติดต่อเรา" },
];

/** Only page links can be current; section anchors never are. */
export function isCurrentPage(href: string, pathname: string) {
  return !href.includes("#") && href === pathname;
}
