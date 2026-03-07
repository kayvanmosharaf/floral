"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdmin } from "../hooks/useAdmin";
import styles from "./admin.module.css";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/messages", label: "Messages" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAdmin();
  const pathname = usePathname();

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className={styles.denied}>
        <div className={styles.deniedCard}>
          <h2>Access Denied</h2>
          <p>You do not have admin privileges to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>Admin</div>
        <ul className={styles.navList}>
          {navItems.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`${styles.navItem} ${pathname === href ? styles.navItemActive : ""}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
