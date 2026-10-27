"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isCurrentPage, type NavLink } from "@/components/navLinks";

export default function MainNav({ links }: { links: NavLink[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="เมนูหลัก" className="hidden gap-6 text-sm font-medium lg:flex">
      {links.map((link) => {
        const current = isCurrentPage(link.href, pathname);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={current ? "page" : undefined}
            className={
              current
                ? "text-brand"
                : "text-foreground/70 transition-colors hover:text-brand"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
