// app/Nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Home" },
  { href: "/assistant", label: "Assistant" },
  { href: "/bases", label: "Base Designs" },
  { href: "/raid", label: "Raid Calculator" },
  { href: "/faq", label: "FAQ" },
  { href: "/pricing", label: "Pricing" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="brandmark">
          <span className="brand-logo">
            {/* simple placeholder logo mark — swap for your own later */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
              <path d="M4 20V8l8-5 8 5v12h-5v-6H9v6z" />
            </svg>
          </span>
          <span className="brand-text">
            <span className="wipe">WIPE</span>{" "}
            <span className="day">DAY</span>
          </span>
        </Link>
        <div className="nav-links">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={"nav-tab" + (pathname === t.href ? " active" : "")}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}