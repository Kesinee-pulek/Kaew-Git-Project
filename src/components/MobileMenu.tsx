"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, type ReactNode } from "react";
import { isCurrentPage, type NavLink } from "@/components/navLinks";

export default function MobileMenu({ links, children }: { links: NavLink[]; children?: ReactNode }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  // Close the menu after a link is tapped so it doesn't cover the section.
  const close = () => {
    if (detailsRef.current) detailsRef.current.open = false;
  };

  return (
    <details ref={detailsRef} className="relative lg:hidden">
      <summary className="cursor-pointer list-none rounded-md px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 [&::-webkit-details-marker]:hidden">
        เมนู ☰
      </summary>
      <nav
        aria-label="เมนูหลัก (มือถือ)"
        className="absolute right-0 mt-2 flex w-52 flex-col rounded-lg border border-black/10 bg-background p-2 shadow-lg dark:border-white/10"
      >
        {links.map((link) => {
          const current = isCurrentPage(link.href, pathname);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              aria-current={current ? "page" : undefined}
              className={`rounded-md px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10 ${current ? "font-semibold text-brand" : ""}`}
            >
              {link.label}
            </Link>
          );
        })}
        {children}
      </nav>
    </details>
  );
}
