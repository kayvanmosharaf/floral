import React from "react";
import { render, screen, fireEvent } from "../utils/test-utils";
import Navbar from "@/app/components/Navbar";

const mockUseAuthenticator = (globalThis as Record<string, unknown>).__mockUseAuthenticator as jest.Mock;
const mockSignOut = (globalThis as Record<string, unknown>).__mockSignOut as jest.Mock;

// Mock useAdmin
jest.mock("@/app/hooks/useAdmin", () => ({
  useAdmin: jest.fn(() => ({ isAdmin: false, loading: false })),
}));

// Mock AuthModal
jest.mock("@/app/components/AuthModal", () => {
  return function MockAuthModal({ onClose }: { onClose: () => void }) {
    return <div data-testid="auth-modal"><button onClick={onClose}>Close</button></div>;
  };
});

import { useAdmin } from "@/app/hooks/useAdmin";

describe("Navbar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthenticator.mockReturnValue({
      authStatus: "authenticated",
      user: { username: "testuser" },
      signOut: mockSignOut,
    });
    (useAdmin as jest.Mock).mockReturnValue({ isAdmin: false, loading: false });
  });

  it("renders all navigation links", () => {
    render(<Navbar />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Shop")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Gallery")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("renders logo", () => {
    render(<Navbar />);
    expect(screen.getByText(/Tuberose Floral/)).toBeInTheDocument();
  });

  it("shows Sign out button when authenticated", () => {
    render(<Navbar />);
    expect(screen.getByText("Sign out")).toBeInTheDocument();
  });

  it("shows Sign in button when unauthenticated", () => {
    mockUseAuthenticator.mockReturnValue({
      authStatus: "unauthenticated",
      user: undefined,
      signOut: mockSignOut,
    });
    render(<Navbar />);
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  it("calls signOut when Sign out button is clicked", () => {
    render(<Navbar />);
    fireEvent.click(screen.getByText("Sign out"));
    expect(mockSignOut).toHaveBeenCalled();
  });

  it("shows Admin link when isAdmin is true", () => {
    (useAdmin as jest.Mock).mockReturnValue({ isAdmin: true, loading: false });
    render(<Navbar />);
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("does not show Admin link when isAdmin is false", () => {
    render(<Navbar />);
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });

  it("toggles mobile menu", () => {
    render(<Navbar />);
    const hamburger = screen.getByLabelText("Toggle menu");
    fireEvent.click(hamburger);
    // After click the button text should change to close icon
    expect(hamburger.textContent).toBe("✕");
    fireEvent.click(hamburger);
    expect(hamburger.textContent).toBe("☰");
  });
});
