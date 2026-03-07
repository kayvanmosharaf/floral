"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import adminStyles from "../admin.module.css";
import styles from "./orders.module.css";

const client = generateClient<Schema>();

const STATUS_OPTIONS = ["pending", "preparing", "shipped", "delivered"];

interface Order {
  id: string;
  orderNumber: string;
  items: string;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  cardLast4: string;
  subtotal: number;
  delivery: number;
  tax: number;
  total: number;
  status: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await client.models.Order.list({ authMode: "userPool" });
        const sorted = [...(data as unknown as Order[])].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sorted);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    await client.models.Order.update({ id, status }, { authMode: "userPool" });
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  if (loading) return <p style={{ color: "#888", padding: "2rem" }}>Loading orders...</p>;

  return (
    <div>
      <div className={styles.header}>
        <h1>Orders</h1>
      </div>

      {orders.length === 0 ? (
        <p style={{ color: "#888" }}>No orders yet.</p>
      ) : (
        <table className={adminStyles.table}>
          <thead>
            <tr>
              <th></th>
              <th>Order #</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const isExpanded = expandedId === order.id;
              let itemsList: { name: string; quantity: number; price: number }[] = [];
              try { itemsList = JSON.parse(order.items); } catch { /* empty */ }

              return (
                <>
                  <tr key={order.id}>
                    <td>
                      <button
                        className={styles.expandBtn}
                        onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      >
                        {isExpanded ? "−" : "+"}
                      </button>
                    </td>
                    <td>{order.orderNumber}</td>
                    <td>{order.shippingName}</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>
                      <select
                        className={adminStyles.statusSelect}
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${order.id}-detail`} className={adminStyles.expandedRow}>
                      <td colSpan={6}>
                        <div className={styles.detailGrid}>
                          <span className={styles.detailLabel}>Ship To</span>
                          <span className={styles.detailValue}>
                            {order.shippingName}, {order.shippingAddress}, {order.shippingCity}, {order.shippingState} {order.shippingZip}
                          </span>
                          <span className={styles.detailLabel}>Card</span>
                          <span className={styles.detailValue}>**** {order.cardLast4}</span>
                          <span className={styles.detailLabel}>Subtotal</span>
                          <span className={styles.detailValue}>${order.subtotal.toFixed(2)}</span>
                          <span className={styles.detailLabel}>Delivery</span>
                          <span className={styles.detailValue}>${order.delivery.toFixed(2)}</span>
                          <span className={styles.detailLabel}>Tax</span>
                          <span className={styles.detailValue}>${order.tax.toFixed(2)}</span>
                        </div>
                        <div className={styles.itemsList}>
                          {itemsList.map((item, i) => (
                            <div key={i} className={styles.itemRow}>
                              <span>{item.name} x {item.quantity}</span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
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
