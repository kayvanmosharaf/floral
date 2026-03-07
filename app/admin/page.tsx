"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import styles from "./admin.module.css";

const client = generateClient<Schema>();

interface OrderSummary {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
}

interface MessageSummary {
  id: string;
  name: string;
  subject: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [recentRevenue, setRecentRevenue] = useState(0);
  const [recentOrders, setRecentOrders] = useState<OrderSummary[]>([]);
  const [recentMessages, setRecentMessages] = useState<MessageSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [productsRes, ordersRes, messagesRes] = await Promise.all([
          client.models.Product.list({ authMode: "userPool" }),
          client.models.Order.list({ authMode: "userPool" }),
          client.models.ContactMessage.list({ authMode: "userPool" }),
        ]);

        const products = productsRes.data;
        const orders = ordersRes.data as unknown as OrderSummary[];
        const messages = messagesRes.data as unknown as MessageSummary[];

        setProductCount(products.length);
        setOrderCount(orders.length);
        setMessageCount(messages.length);
        setRecentRevenue(
          orders.reduce((sum, o) => sum + (o.total || 0), 0)
        );
        setRecentOrders(
          [...orders]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
        );
        setRecentMessages(
          [...messages]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
        );
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p style={{ color: "#888", padding: "2rem" }}>Loading dashboard...</p>;

  return (
    <div>
      <h1 className={styles.pageTitle}>Dashboard</h1>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{productCount}</span>
          <span className={styles.statLabel}>Products</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{orderCount}</span>
          <span className={styles.statLabel}>Orders</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{messageCount}</span>
          <span className={styles.statLabel}>Messages</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>${recentRevenue.toFixed(2)}</span>
          <span className={styles.statLabel}>Total Revenue</span>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>Recent Orders</h2>
      {recentOrders.length === 0 ? (
        <p style={{ color: "#888" }}>No orders yet.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.orderNumber}</td>
                <td>${order.total.toFixed(2)}</td>
                <td>
                  <span className={`${styles.badge} ${styles[`badge${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`] || ""}`}>
                    {order.status}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className={styles.sectionTitle}>Recent Messages</h2>
      {recentMessages.length === 0 ? (
        <p style={{ color: "#888" }}>No messages yet.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>From</th>
              <th>Subject</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentMessages.map((msg) => (
              <tr key={msg.id}>
                <td>{msg.name}</td>
                <td>{msg.subject}</td>
                <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
