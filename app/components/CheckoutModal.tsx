"use client";

import { useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import type { CartProduct } from "../context/CartContext";
import styles from "./CheckoutModal.module.css";

const client = generateClient<Schema>();

type CartItem = { product: CartProduct; quantity: number };

type Props = {
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  clearCart: () => void;
};

const STEPS = ["Shipping", "Payment", "Review", "Done"] as const;

function generateOrderNumber() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "TF-";
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

export default function CheckoutModal({ onClose, items, subtotal, clearCart }: Props) {
  const [step, setStep] = useState(0);
  const [orderNumber, setOrderNumber] = useState("");
  const [placing, setPlacing] = useState(false);

  // Shipping fields
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  // Payment fields
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const delivery = 15;
  const tax = parseFloat((subtotal * 0.08).toFixed(2));
  const total = subtotal + delivery + tax;

  const maskedCard = cardNumber.length >= 4 ? `---- ${cardNumber.slice(-4)}` : "---- ----";

  async function nextStep() {
    if (step === 2) {
      setPlacing(true);
      try {
        const num = generateOrderNumber();
        await client.models.Order.create(
          {
            items: JSON.stringify(
              items.map(({ product, quantity }) => ({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity,
              }))
            ),
            shippingName: name,
            shippingAddress: address,
            shippingCity: city,
            shippingState: state,
            shippingZip: zip,
            cardLast4: cardNumber.slice(-4),
            subtotal,
            delivery,
            tax,
            total,
            orderNumber: num,
          },
          { authMode: "userPool" }
        );
        setOrderNumber(num);
      } catch (err) {
        console.error("Failed to place order:", err);
      } finally {
        setPlacing(false);
      }
    }
    setStep((s) => s + 1);
  }

  function handleConfirm() {
    clearCart();
    onClose();
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">X</button>

        {/* Step indicator */}
        <div className={styles.steps}>
          {STEPS.map((label, i) => (
            <span key={label}>
              {i > 0 && <span className={styles.stepSeparator} />}
              <span className={`${styles.step} ${i === step ? styles.stepActive : ""} ${i < step ? styles.stepDone : ""}`}>
                <span className={styles.stepDot} />
                {label}
              </span>
            </span>
          ))}
        </div>

        {/* Step 1: Shipping */}
        {step === 0 && (
          <>
            <h2 className={styles.heading}>Shipping Address</h2>
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label>Full Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
              </div>
              <div className={styles.field}>
                <label>Street Address</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Bloom St" />
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>City</label>
                  <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Los Angeles" />
                </div>
                <div className={styles.field}>
                  <label>State</label>
                  <input value={state} onChange={(e) => setState(e.target.value)} placeholder="CA" />
                </div>
                <div className={styles.field}>
                  <label>ZIP</label>
                  <input value={zip} onChange={(e) => setZip(e.target.value)} placeholder="90001" />
                </div>
              </div>
            </div>
            <div className={styles.actions}>
              <button className={styles.secondaryBtn} onClick={onClose}>Cancel</button>
              <button className={styles.primaryBtn} onClick={nextStep}>Continue to Payment</button>
            </div>
          </>
        )}

        {/* Step 2: Payment */}
        {step === 1 && (
          <>
            <h2 className={styles.heading}>Payment Details</h2>
            <div className={styles.fieldGroup}>
              <label className={styles.field} style={{ marginBottom: 0 }}>
                <span style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#b85c74", marginBottom: "0.3rem" }}>Card Information</span>
              </label>
              <div className={styles.cardGroup}>
                <div className={styles.cardRow}>
                  <span className={styles.cardIcon}>Card</span>
                  <input
                    className={styles.cardNumberInput}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 1234 1234 1234"
                  />
                </div>
                <div className={styles.cardDivider} />
                <div className={styles.cardBottomRow}>
                  <input
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM / YY"
                  />
                  <input
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="CVC"
                  />
                </div>
              </div>
            </div>
            <div className={styles.actions}>
              <button className={styles.secondaryBtn} onClick={() => setStep(0)}>Back</button>
              <button className={styles.primaryBtn} onClick={nextStep}>Review Order</button>
            </div>
          </>
        )}

        {/* Step 3: Review */}
        {step === 2 && (
          <>
            <h2 className={styles.heading}>Review Your Order</h2>

            <div className={styles.summarySection}>
              <div className={styles.summaryLabel}>Shipping To</div>
              <div className={styles.summaryValue}>
                {name}<br />
                {address}<br />
                {city}, {state} {zip}
              </div>
            </div>

            <div className={styles.summarySection}>
              <div className={styles.summaryLabel}>Payment</div>
              <div className={styles.summaryValue}>{maskedCard}</div>
            </div>

            <div className={styles.summarySection}>
              <div className={styles.summaryLabel}>Items</div>
              <div className={styles.summaryItems}>
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className={styles.summaryItemRow}>
                    <span>{product.name} x {quantity}</span>
                    <span>${(product.price * quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className={styles.summaryItemRow}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryItemRow}>
                <span>Delivery</span>
                <span>${delivery.toFixed(2)}</span>
              </div>
              <div className={styles.summaryItemRow}>
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <hr className={styles.summaryDivider} />
              <div className={styles.summaryTotalRow}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.secondaryBtn} onClick={() => setStep(1)}>Back</button>
              <button className={styles.primaryBtn} onClick={nextStep} disabled={placing}>
                {placing ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </>
        )}

        {/* Step 4: Confirmation */}
        {step === 3 && (
          <div className={styles.confirmation}>
            <div className={styles.confirmIcon}>🌸</div>
            <h2 className={styles.confirmHeading}>Order Confirmed!</h2>
            <p className={styles.orderNumber}>Order #{orderNumber}</p>
            <button className={styles.confirmBtn} onClick={handleConfirm}>Continue Shopping</button>
          </div>
        )}
      </div>
    </div>
  );
}
