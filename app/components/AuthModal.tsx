"use client";

import { Authenticator, ThemeProvider, useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect } from "react";
import styles from "./AuthModal.module.css";

const floralTheme = {
  name: "floral",
  tokens: {
    colors: {
      brand: {
        primary: {
          10:  { value: "#fdf5f7" },
          20:  { value: "#f9e0e7" },
          40:  { value: "#f0b8c8" },
          60:  { value: "#d4788e" },
          80:  { value: "#b85c74" },
          90:  { value: "#a04e65" },
          100: { value: "#8b4257" },
        },
      },
    },
    fonts: {
      default: {
        variable: { value: "'Inter', system-ui, sans-serif" },
        static:   { value: "'Inter', system-ui, sans-serif" },
      },
    },
    radii: {
      small:  { value: "6px" },
      medium: { value: "8px" },
      large:  { value: "10px" },
      xl:     { value: "12px" },
    },
  },
};

function AuthHeader() {
  return (
    <div className={styles.brandHeader}>
      <span className={styles.brandIcon}>🌸</span>
      <span className={styles.brandName}>Tuberose Floral</span>
    </div>
  );
}

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const { authStatus } = useAuthenticator();

  useEffect(() => {
    if (authStatus === "authenticated") onClose();
  }, [authStatus, onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        <ThemeProvider theme={floralTheme}>
          <Authenticator components={{ Header: AuthHeader }} />
        </ThemeProvider>
      </div>
    </div>
  );
}
