"use client";

import { useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import AuthModal from "../components/AuthModal";
import styles from "./contact.module.css";

const client = generateClient<Schema>();

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { authStatus } = useAuthenticator();

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
      const { errors } = await client.models.ContactMessage.create(
        {
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          eventDate: form.eventDate || undefined,
          subject: form.subject,
          message: form.message,
        },
        { authMode: "userPool" }
      );

      if (errors) {
        setError("Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
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
          {submitted ? (
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

              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? "Sending..." : "Send Message"}
              </button>
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
