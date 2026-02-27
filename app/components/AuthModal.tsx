"use client";

import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect } from "react";
import styles from "./AuthModal.module.css";

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const { authStatus } = useAuthenticator();

  useEffect(() => {
    if (authStatus === "authenticated") onClose();
  }, [authStatus, onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        <Authenticator />
      </div>
    </div>
  );
}
