"use client";

import { useState, useEffect, useCallback } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import adminStyles from "../admin.module.css";
import styles from "./products.module.css";

const client = generateClient<Schema>();

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  query: string;
  description?: string | null;
  inStock?: boolean | null;
}

const emptyForm = { name: "", category: "Bouquets", price: "", query: "", description: "", inStock: true };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadProducts = useCallback(async () => {
    try {
      const { data } = await client.models.Product.list({ authMode: "userPool" });
      setProducts(data as unknown as Product[]);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      query: product.query,
      description: product.description || "",
      inStock: product.inStock !== false,
    });
    setShowForm(true);
  }

  async function handleSave() {
    const payload = {
      name: form.name,
      category: form.category,
      price: parseFloat(form.price),
      query: form.query,
      description: form.description || undefined,
      inStock: form.inStock,
    };

    if (editingId) {
      await client.models.Product.update({ id: editingId, ...payload }, { authMode: "userPool" });
    } else {
      await client.models.Product.create(payload, { authMode: "userPool" });
    }

    setShowForm(false);
    setLoading(true);
    loadProducts();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    await client.models.Product.delete({ id }, { authMode: "userPool" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading) return <p style={{ color: "#888", padding: "2rem" }}>Loading products...</p>;

  return (
    <div>
      <div className={styles.header}>
        <h1>Products</h1>
        <button className={styles.addBtn} onClick={openCreate}>+ Add Product</button>
      </div>

      <table className={adminStyles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>
                <span className={`${styles.stockBadge} ${product.inStock !== false ? styles.inStock : styles.outOfStock}`}>
                  {product.inStock !== false ? "In Stock" : "Out of Stock"}
                </span>
              </td>
              <td>
                <div className={adminStyles.actions}>
                  <button className={`${adminStyles.btn} ${adminStyles.btnSecondary} ${adminStyles.btnSmall}`} onClick={() => openEdit(product)}>Edit</button>
                  <button className={`${adminStyles.btn} ${adminStyles.btnDanger} ${adminStyles.btnSmall}`} onClick={() => handleDelete(product.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className={adminStyles.modalOverlay} onClick={() => setShowForm(false)}>
          <div className={adminStyles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? "Edit Product" : "Add Product"}</h2>

            <div className={adminStyles.formField}>
              <label>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>

            <div className={adminStyles.formField}>
              <label>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="Bouquets">Bouquets</option>
                <option value="Weddings">Weddings</option>
                <option value="Events">Events</option>
                <option value="Plants">Plants</option>
              </select>
            </div>

            <div className={adminStyles.formField}>
              <label>Price</label>
              <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>

            <div className={adminStyles.formField}>
              <label>Image Query (Unsplash)</label>
              <input value={form.query} onChange={(e) => setForm({ ...form, query: e.target.value })} />
            </div>

            <div className={adminStyles.formField}>
              <label>Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className={adminStyles.formField}>
              <div className={adminStyles.toggleRow}>
                <button
                  type="button"
                  className={`${adminStyles.toggle} ${form.inStock ? adminStyles.toggleOn : ""}`}
                  onClick={() => setForm({ ...form, inStock: !form.inStock })}
                />
                <span style={{ fontSize: "0.9rem", color: "#333" }}>In Stock</span>
              </div>
            </div>

            <div className={adminStyles.formActions}>
              <button className={`${adminStyles.btn} ${adminStyles.btnSecondary}`} onClick={() => setShowForm(false)}>Cancel</button>
              <button className={`${adminStyles.btn} ${adminStyles.btnPrimary}`} onClick={handleSave}>
                {editingId ? "Save Changes" : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
