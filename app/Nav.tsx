// app/Nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

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
          <img src="/logo.png" alt="Wipe Day logo" className="brand-logo-img" />
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
        <div className="nav-auth">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="auth-login">Log in</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="auth-signup">Sign up</button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </nav>
  );
}