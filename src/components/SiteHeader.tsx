import Link from "next/link";
import MobileMenu from "@/components/MobileMenu";

const navLinks = [
  { href: "#stats", label: "ข้อมูลเมือง" },
  { href: "#attractions", label: "สถานที่ท่องเที่ยว" },
  { href: "#highlights", label: "อาหารและวัฒนธรรม" },
  { href: "#contact", label: "ติดต่อเรา" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-background/90 backdrop-blur dark:border-white/10">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight">
          <span className="text-brand">Chengdu</span> Travel 🐼
        </Link>

        <nav className="hidden gap-6 text-sm font-medium md:flex">
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
