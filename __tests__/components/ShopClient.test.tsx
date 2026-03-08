import React from "react";
import { render, screen, fireEvent } from "../utils/test-utils";
import ShopClient from "@/app/shop/ShopClient";

const mockProducts = [
  { id: "1", name: "Rose Bouquet", category: "Bouquets", price: 49.99, query: "roses", imageUrl: "https://example.com/rose.jpg" },
  { id: "2", name: "Wedding Arch", category: "Weddings", price: 199.99, query: "wedding flowers", imageUrl: "https://example.com/wedding.jpg" },
  { id: "3", name: "Event Centerpiece", category: "Events", price: 89.99, query: "centerpiece", imageUrl: null },
  { id: "4", name: "Potted Fern", category: "Plants", price: 29.99, query: "fern", imageUrl: "https://example.com/fern.jpg" },
];

describe("ShopClient", () => {
  it("renders all products", () => {
    render(<ShopClient products={mockProducts} />);
    expect(screen.getByText("Rose Bouquet")).toBeInTheDocument();
    expect(screen.getByText("Wedding Arch")).toBeInTheDocument();
    expect(screen.getByText("Event Centerpiece")).toBeInTheDocument();
    expect(screen.getByText("Potted Fern")).toBeInTheDocument();
  });

  it("renders category filter buttons", () => {
    render(<ShopClient products={mockProducts} />);
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bouquets" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Weddings" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Events" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Plants" })).toBeInTheDocument();
  });

  it("filters products by category", () => {
    render(<ShopClient products={mockProducts} />);
    fireEvent.click(screen.getByRole("button", { name: "Bouquets" }));
    expect(screen.getByText("Rose Bouquet")).toBeInTheDocument();
    expect(screen.queryByText("Wedding Arch")).not.toBeInTheDocument();
    expect(screen.queryByText("Potted Fern")).not.toBeInTheDocument();
  });

  it("shows all products when All filter is selected", () => {
    render(<ShopClient products={mockProducts} />);
    fireEvent.click(screen.getByRole("button", { name: "Bouquets" }));
    fireEvent.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getByText("Rose Bouquet")).toBeInTheDocument();
    expect(screen.getByText("Wedding Arch")).toBeInTheDocument();
  });

  it("renders Add to Cart buttons", () => {
    render(<ShopClient products={mockProducts} />);
    const addButtons = screen.getAllByText("+ Add to Cart");
    expect(addButtons.length).toBe(4);
  });

  it("shows prices for each product", () => {
    render(<ShopClient products={mockProducts} />);
    expect(screen.getByText("$49.99")).toBeInTheDocument();
    expect(screen.getByText("$199.99")).toBeInTheDocument();
  });

  it("renders page header", () => {
    render(<ShopClient products={mockProducts} />);
    expect(screen.getByText("Shop")).toBeInTheDocument();
    expect(screen.getByText("Fresh arrangements for every occasion")).toBeInTheDocument();
  });
});
