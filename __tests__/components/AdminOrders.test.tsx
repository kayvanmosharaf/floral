import React from "react";
import { render, screen, fireEvent, waitFor } from "../utils/test-utils";
import AdminOrdersPage from "@/app/admin/orders/page";

jest.mock("aws-amplify/data", () => {
  const mockUpdate = jest.fn().mockResolvedValue({ data: {} });
  return {
    generateClient: () => ({
      models: {
        Order: {
          list: jest.fn().mockResolvedValue({
            data: [
              {
                id: "o1",
                orderNumber: "TF-ABC123",
                items: JSON.stringify([{ name: "Rose Bouquet", quantity: 2, price: 49.99 }]),
                shippingName: "Jane Doe",
                shippingAddress: "123 Main St",
                shippingCity: "LA",
                shippingState: "CA",
                shippingZip: "90001",
                cardLast4: "4242",
                subtotal: 99.98,
                delivery: 15,
                tax: 8.0,
                total: 122.98,
                status: "pending",
                createdAt: "2024-01-15T10:00:00Z",
              },
            ],
          }),
          update: mockUpdate,
        },
      },
    }),
    __mockUpdate: mockUpdate,
  };
});

const { __mockUpdate: mockUpdate } = jest.requireMock("aws-amplify/data");

describe("AdminOrdersPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders order table after loading", async () => {
    render(<AdminOrdersPage />);
    await waitFor(() => {
      expect(screen.getByText("TF-ABC123")).toBeInTheDocument();
    });
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("$122.98")).toBeInTheDocument();
  });

  it("shows loading state initially", () => {
    render(<AdminOrdersPage />);
    expect(screen.getByText("Loading orders...")).toBeInTheDocument();
  });

  it("expands order details", async () => {
    render(<AdminOrdersPage />);
    await waitFor(() => {
      expect(screen.getByText("TF-ABC123")).toBeInTheDocument();
    });
    const expandBtn = screen.getByText("+");
    fireEvent.click(expandBtn);
    expect(screen.getByText(/Rose Bouquet x 2/)).toBeInTheDocument();
    expect(screen.getByText(/\*{4} 4242/)).toBeInTheDocument();
  });

  it("updates status via dropdown", async () => {
    render(<AdminOrdersPage />);
    await waitFor(() => {
      expect(screen.getByText("TF-ABC123")).toBeInTheDocument();
    });
    const select = screen.getByDisplayValue("Pending");
    fireEvent.change(select, { target: { value: "shipped" } });
    expect(mockUpdate).toHaveBeenCalledWith(
      { id: "o1", status: "shipped" },
      { authMode: "userPool" }
    );
  });

  it("collapses expanded order", async () => {
    render(<AdminOrdersPage />);
    await waitFor(() => {
      expect(screen.getByText("TF-ABC123")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("+"));
    expect(screen.getByText(/Rose Bouquet x 2/)).toBeInTheDocument();
    fireEvent.click(screen.getByText("−"));
    expect(screen.queryByText(/Rose Bouquet x 2/)).not.toBeInTheDocument();
  });
});
