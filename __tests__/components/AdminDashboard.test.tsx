import React from "react";
import { render, screen, waitFor } from "../utils/test-utils";
import AdminDashboard from "@/app/admin/page";

jest.mock("aws-amplify/data", () => ({
  generateClient: () => ({
    models: {
      Product: {
        list: jest.fn().mockResolvedValue({
          data: [
            { id: "1", name: "Rose Bouquet", category: "Bouquets", price: 49.99 },
            { id: "2", name: "Lily", category: "Events", price: 79.99 },
          ],
        }),
      },
      Order: {
        list: jest.fn().mockResolvedValue({
          data: [
            { id: "o1", orderNumber: "TF-ABC123", total: 129.98, status: "pending", createdAt: "2024-01-15T10:00:00Z" },
            { id: "o2", orderNumber: "TF-DEF456", total: 79.99, status: "shipped", createdAt: "2024-01-16T10:00:00Z" },
          ],
        }),
      },
      ContactMessage: {
        list: jest.fn().mockResolvedValue({
          data: [
            { id: "m1", name: "Alice", subject: "Wedding Inquiry", createdAt: "2024-01-15T10:00:00Z" },
            { id: "m2", name: "Bob", subject: "Order Question", createdAt: "2024-01-16T10:00:00Z" },
          ],
        }),
      },
    },
  }),
}));

describe("AdminDashboard", () => {
  it("shows loading state initially", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Loading dashboard...")).toBeInTheDocument();
  });

  it("shows stat cards after loading", async () => {
    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText("Products")).toBeInTheDocument();
    });
    const twos = screen.getAllByText("2");
    expect(twos.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("Messages")).toBeInTheDocument();
  });

  it("shows total revenue", async () => {
    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText("Total Revenue")).toBeInTheDocument();
    });
    expect(screen.getByText("$209.97")).toBeInTheDocument();
  });

  it("shows recent orders table", async () => {
    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText("Recent Orders")).toBeInTheDocument();
    });
    expect(screen.getByText("TF-ABC123")).toBeInTheDocument();
    expect(screen.getByText("TF-DEF456")).toBeInTheDocument();
  });

  it("shows recent messages table", async () => {
    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText("Recent Messages")).toBeInTheDocument();
    });
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Wedding Inquiry")).toBeInTheDocument();
  });
});
