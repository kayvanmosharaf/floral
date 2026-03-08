import React from "react";
import { render, screen, waitFor } from "../utils/test-utils";
import AdminLayout from "@/app/admin/layout";

jest.mock("@/app/hooks/useAdmin", () => ({
  useAdmin: jest.fn(() => ({ isAdmin: true, loading: false })),
}));

import { useAdmin } from "@/app/hooks/useAdmin";

describe("AdminLayout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows Access Denied for non-admin", () => {
    (useAdmin as jest.Mock).mockReturnValue({ isAdmin: false, loading: false });
    render(<AdminLayout><div>Child</div></AdminLayout>);
    expect(screen.getByText("Access Denied")).toBeInTheDocument();
    expect(screen.queryByText("Child")).not.toBeInTheDocument();
  });

  it("shows sidebar navigation for admin", () => {
    (useAdmin as jest.Mock).mockReturnValue({ isAdmin: true, loading: false });
    render(<AdminLayout><div>Child content</div></AdminLayout>);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("Messages")).toBeInTheDocument();
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    (useAdmin as jest.Mock).mockReturnValue({ isAdmin: false, loading: true });
    render(<AdminLayout><div>Child</div></AdminLayout>);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("nav items link to correct routes", () => {
    (useAdmin as jest.Mock).mockReturnValue({ isAdmin: true, loading: false });
    render(<AdminLayout><div>Child</div></AdminLayout>);
    expect(screen.getByText("Dashboard").closest("a")).toHaveAttribute("href", "/admin");
    expect(screen.getByText("Products").closest("a")).toHaveAttribute("href", "/admin/products");
    expect(screen.getByText("Orders").closest("a")).toHaveAttribute("href", "/admin/orders");
    expect(screen.getByText("Messages").closest("a")).toHaveAttribute("href", "/admin/messages");
  });
});
