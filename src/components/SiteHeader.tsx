import Link from "next/link";
import MobileMenu from "@/components/MobileMenu";
import PeaLogo from "@/components/PeaLogo";

const navLinks = [
  { href: "#stats", label: "ผลการดำเนินงาน" },
  { href: "#categories", label: "หมวดหลักสูตร" },
  { href: "#courses", label: "หลักสูตรยอดนิยม" },
  { href: "#how", label: "ขั้นตอนการเรียน" },
  { href: "#contact", label: "ติดต่อเรา" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-background/90 backdrop-blur dark:border-white/10">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <PeaLogo />
          <span className="leading-tight">
            <span className="block text-sm font-bold">ศูนย์อบรมออนไลน์ กฟภ.</span>
            <span className="block text-xs text-foreground/60">
              การไฟฟ้าส่วนภูมิภาค
            </span>
          </span>
        </Link>

        <nav className="hidden gap-6 text-sm font-medium lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-foreground/70 transition-colors hover:text-brand"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <MobileMenu links={navLinks} />
      </div>
    </header>
  );
}
