"use client";

import { useRef } from "react";

type NavLink = { href: string; label: string };

export default function MobileMenu({ links }: { links: NavLink[] }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  // Close the menu after a link is tapped so it doesn't cover the section.
  const close = () => {
    if (detailsRef.current) detailsRef.current.open = false;
  };

  return (
    <details ref={detailsRef} className="relative md:hidden">
      <summary className="cursor-pointer list-none rounded-md px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 [&::-webkit-details-marker]:hidden">
        เมนู ☰
      </summary>
      <nav className="absolute right-0 mt-2 flex w-52 flex-col rounded-lg border border-black/10 bg-background p-2 shadow-lg dark:border-white/10">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={close}
            className="rounded-md px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </details>
  );
}
