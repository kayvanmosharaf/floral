"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import styles from "./cart.module.css";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();

  const delivery = subtotal > 0 ? 15 : 0;
  const tax = parseFloat((subtotal * 0.08).toFixed(2));
  const total = subtotal + delivery + tax;

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyIcon}>🛒</p>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven&apos;t added anything yet.</p>
        <Link href="/shop" className={styles.shopLink}>Browse the Shop</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Your Cart</h1>
        <button className={styles.clearBtn} onClick={clearCart}>Clear all</button>
      </div>

      <div className={styles.layout}>
        {/* Items */}
        <div className={styles.items}>
          {items.map(({ product, quantity }) => (
            <div key={product.id} className={styles.item}>
              <div
                className={styles.itemImage}
                style={{
                  backgroundImage: product.imageUrl ? `url('${product.imageUrl}')` : undefined,
                  backgroundColor: product.imageUrl ? undefined : "#f0e6e6",
                }}
              />
              <div className={styles.itemDetails}>
                <p className={styles.itemCategory}>{product.category}</p>
                <h3 className={styles.itemName}>{product.name}</h3>
                <p className={styles.itemPrice}>${product.price}</p>
              </div>
              <div className={styles.itemActions}>
                <div className={styles.qtyControl}>
                  <button onClick={() => updateQuantity(product.id, quantity - 1)}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => updateQuantity(product.id, quantity + 1)}>+</button>
                </div>
                <p className={styles.itemTotal}>${(product.price * quantity).toFixed(2)}</p>
                <button className={styles.removeBtn} onClick={() => removeFromCart(product.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Delivery</span>
            <span>${delivery.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button className={styles.checkoutBtn}>Proceed to Checkout</button>
          <Link href="/shop" className={styles.continueShopping}>← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
