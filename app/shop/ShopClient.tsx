"use client";

import { useState, useEffect } from "react";
import styles from "./shop.module.css";
import { useCart } from "../context/CartContext";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  query: string;
};

const categories = ["All", "Bouquets", "Weddings", "Events", "Plants"];

export default function ShopClient({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [images, setImages] = useState<Record<number, string>>({});
  const { addToCart, items } = useCart();

  useEffect(() => {
    products.forEach(async (product) => {
      const res = await fetch(`/api/unsplash?q=${encodeURIComponent(product.query)}`);
      const data = await res.json();
      if (data.imageUrl) {
        setImages((prev) => ({ ...prev, [product.id]: data.imageUrl }));
      }
    });
  }, [products]);

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Shop</h1>
        <p className={styles.subtitle}>Fresh arrangements for every occasion</p>
      </div>

      <div className={styles.filters}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map((product) => {
          const inCart = items.some((i) => i.product.id === product.id);
          const imageUrl = images[product.id];
          return (
            <div key={product.id} className={styles.card}>
              <div
                className={styles.image}
                style={{
                  backgroundImage: imageUrl ? `url('${imageUrl}')` : undefined,
                  backgroundColor: imageUrl ? undefined : "#f0e6e6",
                }}
              >
                <span className={styles.categoryTag}>{product.category}</span>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.productName}>{product.name}</h3>
                <div className={styles.cardFooter}>
                  <span className={styles.price}>${product.price}</span>
                  <button
                    className={`${styles.addBtn} ${inCart ? styles.addedBtn : ""}`}
                    onClick={() => addToCart({ ...product, imageUrl: imageUrl ?? null })}
                    disabled={inCart}
                  >
                    {inCart ? "✓ Added" : "+ Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
