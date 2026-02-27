"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import styles from "./Navbar.module.css";
import { useCart } from "../context/CartContext";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();
  const { authStatus, signOut } = useAuthenticator();

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        🌸 Tuberose Floral
      </Link>

      <ul className={`${styles.links} ${menuOpen ? styles.open : ""}`}>
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={`${styles.link} ${pathname === href ? styles.active : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          </li>
        ))}
        {authStatus === "authenticated" && (
          <li>
            <button
              className={styles.signOutBtn}
              onClick={() => { signOut(); setMenuOpen(false); }}
            >
              Sign out
            </button>
          </li>
        )}
      </ul>

      <div className={styles.navRight}>
        <Link href="/cart" className={styles.cart}>
          🛒
          {count > 0 && <span className={styles.cartBadge}>{count}</span>}
        </Link>
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
    </nav>
  );
}
