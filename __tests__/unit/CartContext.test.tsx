import React from "react";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart, CartProduct } from "@/app/context/CartContext";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

const mockProduct: CartProduct = {
  id: "p1",
  name: "Rose Bouquet",
  category: "Bouquets",
  price: 49.99,
  imageUrl: "https://example.com/rose.jpg",
};

const mockProduct2: CartProduct = {
  id: "p2",
  name: "Lily Arrangement",
  category: "Events",
  price: 79.99,
  imageUrl: null,
};

beforeEach(() => {
  localStorage.clear();
});

describe("CartContext", () => {
  it("starts with an empty cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
    expect(result.current.count).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });

  it("adds a new item to cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(mockProduct));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product.id).toBe("p1");
    expect(result.current.items[0].quantity).toBe(1);
  });

  it("increments quantity when adding duplicate item", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(mockProduct));
    act(() => result.current.addToCart(mockProduct));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it("removes an item from cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(mockProduct));
    act(() => result.current.addToCart(mockProduct2));
    act(() => result.current.removeFromCart("p1"));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product.id).toBe("p2");
  });

  it("updates quantity of an item", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(mockProduct));
    act(() => result.current.updateQuantity("p1", 5));
    expect(result.current.items[0].quantity).toBe(5);
  });

  it("removes item when quantity updated to less than 1", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(mockProduct));
    act(() => result.current.updateQuantity("p1", 0));
    expect(result.current.items).toHaveLength(0);
  });

  it("clears all items", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(mockProduct));
    act(() => result.current.addToCart(mockProduct2));
    act(() => result.current.clearCart());
    expect(result.current.items).toHaveLength(0);
    expect(result.current.count).toBe(0);
  });

  it("computes count correctly", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(mockProduct));
    act(() => result.current.addToCart(mockProduct2));
    act(() => result.current.updateQuantity("p1", 3));
    expect(result.current.count).toBe(4); // 3 + 1
  });

  it("computes subtotal correctly", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(mockProduct)); // 49.99
    act(() => result.current.addToCart(mockProduct2)); // 79.99
    act(() => result.current.updateQuantity("p1", 2)); // 2 * 49.99
    expect(result.current.subtotal).toBeCloseTo(49.99 * 2 + 79.99);
  });

  it("persists cart to localStorage", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(mockProduct));
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0].product.id).toBe("p1");
  });

  it("loads cart from localStorage on mount", () => {
    const savedItems = [{ product: mockProduct, quantity: 3 }];
    localStorage.setItem("cart", JSON.stringify(savedItems));
    const { result } = renderHook(() => useCart(), { wrapper });
    // After useEffect runs
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(3);
  });

  it("throws when useCart is used outside CartProvider", () => {
    // Suppress console.error for expected error
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => {
      renderHook(() => useCart());
    }).toThrow("useCart must be used within CartProvider");
    spy.mockRestore();
  });
});
