"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import styles from "./Navbar.module.css";
import { useCart } from "../context/CartContext";
import { useAdmin } from "../hooks/useAdmin";
import AuthModal from "./AuthModal";

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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { count } = useCart();
  const { authStatus, signOut } = useAuthenticator();
  const { isAdmin } = useAdmin();

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
        {isAdmin && (
          <li>
            <Link
              href="/admin"
              className={`${styles.link} ${styles.adminLink} ${pathname.startsWith("/admin") ? styles.active : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              Admin
            </Link>
          </li>
        )}
        <li>
          {authStatus === "authenticated" ? (
            <button
              className={styles.signOutBtn}
              onClick={() => { signOut(); setMenuOpen(false); }}
            >
              Sign out
            </button>
          ) : (
            <button
              className={styles.signOutBtn}
              onClick={() => { setShowAuthModal(true); setMenuOpen(false); }}
            >
              Sign in
            </button>
          )}
        </li>
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
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </nav>
  );
}
