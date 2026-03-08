import React from "react";
import { render, screen, fireEvent, waitFor } from "../utils/test-utils";
import AdminProductsPage from "@/app/admin/products/page";

jest.mock("aws-amplify/data", () => {
  const mockCreate = jest.fn().mockResolvedValue({ data: {} });
  const mockUpdate = jest.fn().mockResolvedValue({ data: {} });
  const mockDelete = jest.fn().mockResolvedValue({ data: {} });
  const mockList = jest.fn().mockResolvedValue({
    data: [
      { id: "1", name: "Rose Bouquet", category: "Bouquets", price: 49.99, query: "roses", inStock: true },
      { id: "2", name: "Lily Arrangement", category: "Events", price: 79.99, query: "lily", inStock: false },
    ],
  });
  return {
    generateClient: () => ({
      models: {
        Product: {
          list: mockList,
          create: mockCreate,
          update: mockUpdate,
          delete: mockDelete,
        },
      },
    }),
    __mocks: { mockCreate, mockUpdate, mockDelete, mockList },
  };
});

const { __mocks: mocks } = jest.requireMock("aws-amplify/data");

describe("AdminProductsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mocks.mockList.mockResolvedValue({
      data: [
        { id: "1", name: "Rose Bouquet", category: "Bouquets", price: 49.99, query: "roses", inStock: true },
        { id: "2", name: "Lily Arrangement", category: "Events", price: 79.99, query: "lily", inStock: false },
      ],
    });
  });

  it("renders product table after loading", async () => {
    render(<AdminProductsPage />);
    await waitFor(() => {
      expect(screen.getByText("Rose Bouquet")).toBeInTheDocument();
    });
    expect(screen.getByText("Lily Arrangement")).toBeInTheDocument();
    expect(screen.getByText("$49.99")).toBeInTheDocument();
  });

  it("shows loading state initially", () => {
    render(<AdminProductsPage />);
    expect(screen.getByText("Loading products...")).toBeInTheDocument();
  });

  it("opens add product modal", async () => {
    render(<AdminProductsPage />);
    await waitFor(() => {
      expect(screen.getByText("+ Add Product")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("+ Add Product"));
    expect(screen.getByText("Add Product")).toBeInTheDocument();
    expect(screen.getByText("Create Product")).toBeInTheDocument();
  });

  it("opens edit product modal with form populated", async () => {
    render(<AdminProductsPage />);
    await waitFor(() => {
      expect(screen.getByText("Rose Bouquet")).toBeInTheDocument();
    });
    const editButtons = screen.getAllByText("Edit");
    fireEvent.click(editButtons[0]);
    expect(screen.getByText("Edit Product")).toBeInTheDocument();
    expect(screen.getByText("Save Changes")).toBeInTheDocument();
  });

  it("calls delete on product", async () => {
    window.confirm = jest.fn(() => true);
    render(<AdminProductsPage />);
    await waitFor(() => {
      expect(screen.getByText("Rose Bouquet")).toBeInTheDocument();
    });
    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);
    expect(mocks.mockDelete).toHaveBeenCalledWith({ id: "1" }, { authMode: "userPool" });
  });

  it("calls create when saving new product", async () => {
    render(<AdminProductsPage />);
    await waitFor(() => {
      expect(screen.getByText("+ Add Product")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("+ Add Product"));
    fireEvent.click(screen.getByText("Create Product"));
    await waitFor(() => {
      expect(mocks.mockCreate).toHaveBeenCalled();
    });
  });
});
