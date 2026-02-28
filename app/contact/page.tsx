"use client";

import { useState, useEffect } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/data";
import { uploadData, getUrl } from "aws-amplify/storage";
import { fetchAuthSession } from "aws-amplify/auth";
import type { Schema } from "@/amplify/data/resource";
import AuthModal from "../components/AuthModal";
import styles from "./contact.module.css";

const client = generateClient<Schema>();

function MessageThumbnail({ attachmentKey }: { attachmentKey: string }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    getUrl({ path: attachmentKey })
      .then((result) => setUrl(result.url.toString()))
      .catch(() => setUrl(null));
  }, [attachmentKey]);

  if (!url) return <span className={styles.attachmentBadge}>Photo attached</span>;

  return (
    <img
      src={url}
      alt="Attachment"
      className={styles.attachmentThumbnail}
    />
  );
}

const FLOWER_IMAGES = [
  "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1596438459194-f275f413d6ff?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1457089328109-e5d9bd499191?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=300&h=300&fit=crop",
];

const ORDER_STATUSES = ["Received", "Preparing", "Shipped", "Out for Delivery", "Arrived"] as const;
type OrderStatus = typeof ORDER_STATUSES[number];

interface OrderRecord {
  id: string;
  subject: string;
  createdAt: string;
  status: OrderStatus;
  imageUrl: string;
}

function getRandomStatus(): OrderStatus {
  return ORDER_STATUSES[Math.floor(Math.random() * ORDER_STATUSES.length)];
}

function OrderStatusTracker({ status }: { status: OrderStatus }) {
  const currentIndex = ORDER_STATUSES.indexOf(status);
  return (
    <div className={styles.statusTracker}>
      {ORDER_STATUSES.map((step, i) => (
        <div key={step} className={styles.statusStep}>
          <div className={`${styles.statusDot} ${i <= currentIndex ? styles.statusDotActive : ""}`} />
          <span className={`${styles.statusLabel} ${i <= currentIndex ? styles.statusLabelActive : ""}`}>{step}</span>
          {i < ORDER_STATUSES.length - 1 && (
            <div className={`${styles.statusLine} ${i < currentIndex ? styles.statusLineActive : ""}`} />
          )}
        </div>
      ))}
    </div>
  );
}

interface ContactMessageRecord {
  subject: string;
  message: string;
  attachmentKey?: string | null;
  createdAt?: string | null;
}

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    subject: "",
    message: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [messages, setMessages] = useState<ContactMessageRecord[]>([]);
  const [showMessages, setShowMessages] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [showOrders, setShowOrders] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const { authStatus } = useAuthenticator();

  async function handleViewMessages() {
    if (authStatus !== "authenticated") {
      setShowAuthModal(true);
      return;
    }

    setLoadingMessages(true);
    setShowMessages(true);
    try {
      const { data } = await client.models.ContactMessage.list({
        authMode: "userPool",
      });
      setMessages(data as unknown as ContactMessageRecord[]);
    } catch {
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }

  async function handleViewOrders() {
    if (authStatus !== "authenticated") {
      setShowAuthModal(true);
      return;
    }

    setLoadingOrders(true);
    setShowOrders(true);
    try {
      const { data } = await client.models.ContactMessage.list({
        authMode: "userPool",
      });
      const mockOrders: OrderRecord[] = (data as unknown as ContactMessageRecord[]).map((msg, i) => ({
        id: `ORD-${String(i + 1).padStart(4, "0")}`,
        subject: msg.subject,
        createdAt: msg.createdAt ?? new Date().toISOString(),
        status: getRandomStatus(),
        imageUrl: FLOWER_IMAGES[Math.floor(Math.random() * FLOWER_IMAGES.length)],
      }));
      setOrders(mockOrders);
    } catch {
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (authStatus !== "authenticated") {
      setShowAuthModal(true);
      return;
    }

    setSubmitting(true);
    try {
      let attachmentKey: string | undefined;

      if (file) {
        const session = await fetchAuthSession();
        const identityId = session.identityId;
        const key = `contact-attachments/${identityId}/${Date.now()}-${file.name}`;
        await uploadData({
          path: key,
          data: file,
          options: { contentType: file.type },
        }).result;
        attachmentKey = key;
      }

      const { errors } = await client.models.ContactMessage.create(
        {
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          eventDate: form.eventDate || undefined,
          subject: form.subject,
          message: form.message,
          attachmentKey,
        },
        { authMode: "userPool" }
      );

      if (errors) {
        setError("Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
      setFile(null);
      setForm({ name: "", email: "", phone: "", eventDate: "", subject: "", message: "" });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Get in Touch</h1>
        <p className={styles.subtitle}>
          We&apos;d love to hear from you — whether it&apos;s a wedding, an event, or a simple bouquet.
        </p>
      </div>

      <div className={styles.layout}>

        {/* Contact Form */}
        <div className={styles.formSection}>
          {showOrders ? (
            <div>
              <div className={styles.messagesHeader}>
                <h2>My Orders</h2>
                <button className={styles.resetBtn} onClick={() => setShowOrders(false)}>Back to Form</button>
              </div>
              {loadingOrders ? (
                <p style={{ color: "#888", textAlign: "center", padding: "2rem 0" }}>Loading orders...</p>
              ) : orders.length === 0 ? (
                <p style={{ color: "#888", textAlign: "center", padding: "2rem 0" }}>No orders yet.</p>
              ) : (
                <div className={styles.messagesList}>
                  {orders.map((order) => (
                    <div key={order.id} className={styles.orderCard}>
                      <div className={styles.orderCardContent}>
                        <div className={styles.orderCardText}>
                          <div className={styles.orderCardHeader}>
                            <span className={styles.orderId}>{order.id}</span>
                            <span className={`${styles.orderStatusBadge} ${styles[`status${order.status.replace(/\s+/g, "")}`]}`}>
                              {order.status}
                            </span>
                          </div>
                          <h3 className={styles.orderSubject}>{order.subject}</h3>
                          <p className={styles.messageDate}>
                            {new Date(order.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <img
                          src={order.imageUrl}
                          alt="Order flower"
                          className={styles.orderThumbnail}
                        />
                      </div>
                      <OrderStatusTracker status={order.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : showMessages ? (
            <div>
              <div className={styles.messagesHeader}>
                <h2>My Messages</h2>
                <button className={styles.resetBtn} onClick={() => setShowMessages(false)}>Back to Form</button>
              </div>
              {loadingMessages ? (
                <p style={{ color: "#888", textAlign: "center", padding: "2rem 0" }}>Loading messages...</p>
              ) : messages.length === 0 ? (
                <p style={{ color: "#888", textAlign: "center", padding: "2rem 0" }}>No messages yet.</p>
              ) : (
                <div className={styles.messagesList}>
                  {messages.map((msg, i) => (
                    <div key={i} className={styles.messageCard}>
                      <div className={styles.messageCardContent}>
                        <div className={styles.messageCardText}>
                          <div className={styles.messageCardHeader}>
                            <h3>{msg.subject}</h3>
                          </div>
                          {msg.createdAt && (
                            <p className={styles.messageDate}>
                              {new Date(msg.createdAt).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          )}
                          <p className={styles.messageBody}>{msg.message}</p>
                        </div>
                        {msg.attachmentKey && <MessageThumbnail attachmentKey={msg.attachmentKey} />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : submitted ? (
            <div className={styles.success}>
              <p className={styles.successIcon}>🌸</p>
              <h2>Thank you!</h2>
              <p>We&apos;ve received your message and will get back to you within 24 hours.</p>
              <button className={styles.resetBtn} onClick={() => setSubmitted(false)}>Send another message</button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              {error && <div className={styles.error}>{error}</div>}

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="name">Full Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="email">Email *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="eventDate">Event Date</label>
                  <input
                    id="eventDate"
                    name="eventDate"
                    type="date"
                    value={form.eventDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="subject">Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={form.subject}
                  onChange={handleChange}
                >
                  <option value="">Select a subject...</option>
                  <option value="bouquet">Bouquet Order</option>
                  <option value="wedding">Wedding Flowers</option>
                  <option value="event">Event Decoration</option>
                  <option value="custom">Custom Arrangement</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell us about your event, preferred flowers, budget, or any special requests..."
                  value={form.message}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="photo">Attach a Photo</label>
                <div className={styles.fileUpload}>
                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                  {file && (
                    <div className={styles.fileName}>
                      <span>{file.name}</span>
                      <button
                        type="button"
                        className={styles.fileRemove}
                        onClick={() => {
                          setFile(null);
                          const input = document.getElementById("photo") as HTMLInputElement;
                          if (input) input.value = "";
                        }}
                        aria-label="Remove file"
                      >
                        &times;
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? "Sending..." : "Send Message"}
              </button>

              <div className={styles.viewBtnsRow}>
                <button type="button" className={styles.viewMessagesBtn} onClick={handleViewMessages}>
                  View My Messages
                </button>
                <button type="button" className={styles.viewMessagesBtn} onClick={handleViewOrders}>
                  View My Orders
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Info Panel */}
        <div className={styles.infoPanel}>
          <div className={styles.infoCard}>
            <h2 className={styles.infoTitle}>Contact Info</h2>

            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>📍</span>
              <div>
                <p className={styles.infoLabel}>Address</p>
                <p className={styles.infoValue}>123 Blossom Lane<br />San Francisco, CA 94102</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>📞</span>
              <div>
                <p className={styles.infoLabel}>Phone</p>
                <p className={styles.infoValue}>(415) 555-0192</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>✉️</span>
              <div>
                <p className={styles.infoLabel}>Email</p>
                <p className={styles.infoValue}>hello@tuberosefloral.com</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>🕐</span>
              <div>
                <p className={styles.infoLabel}>Hours</p>
                <p className={styles.infoValue}>
                  Mon – Fri: 9am – 6pm<br />
                  Sat: 10am – 4pm<br />
                  Sun: Closed
                </p>
              </div>
            </div>

            <div className={styles.social}>
              <p className={styles.infoLabel}>Follow Us</p>
              <div className={styles.socialLinks}>
                <a href="#" aria-label="Instagram">📸 Instagram</a>
                <a href="#" aria-label="Facebook">📘 Facebook</a>
                <a href="#" aria-label="Pinterest">📌 Pinterest</a>
              </div>
            </div>
          </div>
        </div>

      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}
