import React from "react";
import { render, screen, fireEvent, waitFor } from "../utils/test-utils";
import userEvent from "@testing-library/user-event";
import CheckoutModal from "@/app/components/CheckoutModal";

// Must use jest.fn() directly in mock factory (hoisted above variable declarations)
jest.mock("aws-amplify/data", () => {
  const mockOrderCreate = jest.fn().mockResolvedValue({ data: {} });
  return {
    generateClient: () => ({
      models: {
        Order: { create: mockOrderCreate },
      },
    }),
    __mockOrderCreate: mockOrderCreate,
  };
});

const { __mockOrderCreate: mockOrderCreate } = jest.requireMock("aws-amplify/data");

const mockItems = [
  {
    product: { id: "1", name: "Rose Bouquet", category: "Bouquets", price: 49.99, imageUrl: null },
    quantity: 2,
  },
  {
    product: { id: "2", name: "Lily Arrangement", category: "Events", price: 79.99, imageUrl: null },
    quantity: 1,
  },
];
const mockSubtotal = 49.99 * 2 + 79.99; // 179.97
const mockClearCart = jest.fn();
const mockOnClose = jest.fn();

function renderModal() {
  return render(
    <CheckoutModal
      onClose={mockOnClose}
      items={mockItems}
      subtotal={mockSubtotal}
      clearCart={mockClearCart}
    />
  );
}

describe("CheckoutModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders shipping step initially", () => {
    renderModal();
    expect(screen.getByText("Shipping Address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("123 Bloom St")).toBeInTheDocument();
  });

  it("renders step indicators", () => {
    renderModal();
    expect(screen.getByText("Shipping")).toBeInTheDocument();
    expect(screen.getByText("Payment")).toBeInTheDocument();
    expect(screen.getByText("Review")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  it("navigates to payment step", async () => {
    renderModal();
    fireEvent.click(screen.getByText("Continue to Payment"));
    expect(screen.getByText("Payment Details")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("1234 1234 1234 1234")).toBeInTheDocument();
  });

  it("navigates back from payment to shipping", () => {
    renderModal();
    fireEvent.click(screen.getByText("Continue to Payment"));
    fireEvent.click(screen.getByText("Back"));
    expect(screen.getByText("Shipping Address")).toBeInTheDocument();
  });

  it("accepts shipping form input", async () => {
    renderModal();
    const user = userEvent.setup();
    const nameInput = screen.getByPlaceholderText("Jane Doe");
    await user.type(nameInput, "John Smith");
    expect(nameInput).toHaveValue("John Smith");
  });

  it("accepts payment form input", async () => {
    renderModal();
    fireEvent.click(screen.getByText("Continue to Payment"));
    const user = userEvent.setup();
    const cardInput = screen.getByPlaceholderText("1234 1234 1234 1234");
    await user.type(cardInput, "4242424242424242");
    expect(cardInput).toHaveValue("4242424242424242");
  });

  it("shows review step with order summary", async () => {
    renderModal();
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("Jane Doe"), "Jane");
    await user.type(screen.getByPlaceholderText("123 Bloom St"), "123 Main");
    await user.type(screen.getByPlaceholderText("Los Angeles"), "LA");
    await user.type(screen.getByPlaceholderText("CA"), "CA");
    await user.type(screen.getByPlaceholderText("90001"), "90001");
    fireEvent.click(screen.getByText("Continue to Payment"));
    await user.type(screen.getByPlaceholderText("1234 1234 1234 1234"), "4242424242424242");
    await user.type(screen.getByPlaceholderText("MM / YY"), "12/28");
    await user.type(screen.getByPlaceholderText("CVC"), "123");
    fireEvent.click(screen.getByText("Review Order"));
    expect(screen.getByText("Review Your Order")).toBeInTheDocument();
    expect(screen.getByText(/Rose Bouquet x 2/)).toBeInTheDocument();
    expect(screen.getByText(/Lily Arrangement x 1/)).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    renderModal();
    fireEvent.click(screen.getByLabelText("Close"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onClose when Cancel button is clicked", () => {
    renderModal();
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("creates order on Place Order and shows confirmation", async () => {
    renderModal();
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("Jane Doe"), "Jane Doe");
    await user.type(screen.getByPlaceholderText("123 Bloom St"), "123 Main");
    await user.type(screen.getByPlaceholderText("Los Angeles"), "LA");
    await user.type(screen.getByPlaceholderText("CA"), "CA");
    await user.type(screen.getByPlaceholderText("90001"), "90001");
    fireEvent.click(screen.getByText("Continue to Payment"));
    await user.type(screen.getByPlaceholderText("1234 1234 1234 1234"), "4242");
    await user.type(screen.getByPlaceholderText("MM / YY"), "12/28");
    await user.type(screen.getByPlaceholderText("CVC"), "123");
    fireEvent.click(screen.getByText("Review Order"));
    fireEvent.click(screen.getByText("Place Order"));
    await waitFor(() => {
      expect(mockOrderCreate).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(screen.getByText("Order Confirmed!")).toBeInTheDocument();
    });
  });
});
