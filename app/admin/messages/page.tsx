"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { getUrl } from "aws-amplify/storage";
import type { Schema } from "@/amplify/data/resource";
import adminStyles from "../admin.module.css";
import styles from "./messages.module.css";

const client = generateClient<Schema>();

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  eventDate?: string | null;
  subject: string;
  message: string;
  attachmentKey?: string | null;
  createdAt: string;
}

function AttachmentPreview({ attachmentKey }: { attachmentKey: string }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    getUrl({ path: attachmentKey })
      .then((result) => setUrl(result.url.toString()))
      .catch(() => setUrl(null));
  }, [attachmentKey]);

  if (!url) return <span className={styles.attachmentLink}>Attachment (loading...)</span>;
  return <img src={url} alt="Attachment" className={styles.attachmentImg} />;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await client.models.ContactMessage.list({ authMode: "userPool" });
        const sorted = [...(data as unknown as Message[])].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setMessages(sorted);
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p style={{ color: "#888", padding: "2rem" }}>Loading messages...</p>;

  return (
    <div>
      <div className={styles.header}>
        <h1>Messages</h1>
      </div>

      {messages.length === 0 ? (
        <p style={{ color: "#888" }}>No messages yet.</p>
      ) : (
        <table className={adminStyles.table}>
          <thead>
            <tr>
              <th></th>
              <th>From</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => {
              const isExpanded = expandedId === msg.id;
              return (
                <>
                  <tr key={msg.id}>
                    <td>
                      <button
                        className={styles.expandBtn}
                        onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                      >
                        {isExpanded ? "−" : "+"}
                      </button>
                    </td>
                    <td>{msg.name}</td>
                    <td>{msg.email}</td>
                    <td>{msg.subject}</td>
                    <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${msg.id}-detail`} className={adminStyles.expandedRow}>
                      <td colSpan={5}>
                        <div className={styles.metaGrid}>
                          {msg.phone && (
                            <>
                              <span className={styles.metaLabel}>Phone</span>
                              <span className={styles.metaValue}>{msg.phone}</span>
                            </>
                          )}
                          {msg.eventDate && (
                            <>
                              <span className={styles.metaLabel}>Event Date</span>
                              <span className={styles.metaValue}>{msg.eventDate}</span>
                            </>
                          )}
                        </div>
                        <p className={styles.messageBody}>{msg.message}</p>
                        {msg.attachmentKey && <AttachmentPreview attachmentKey={msg.attachmentKey} />}
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
