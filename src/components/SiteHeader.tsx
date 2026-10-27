import Link from "next/link";
import MainNav from "@/components/MainNav";
import MobileMenu from "@/components/MobileMenu";
import PeaLogo from "@/components/PeaLogo";
import { navLinks } from "@/components/navLinks";

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

        <MainNav links={navLinks} />
        <MobileMenu links={navLinks} />
      </div>
    </header>
  );
}
