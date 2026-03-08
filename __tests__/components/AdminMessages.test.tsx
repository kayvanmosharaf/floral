import React from "react";
import { render, screen, fireEvent, waitFor } from "../utils/test-utils";
import AdminMessagesPage from "@/app/admin/messages/page";

jest.mock("aws-amplify/data", () => ({
  generateClient: () => ({
    models: {
      ContactMessage: {
        list: jest.fn().mockResolvedValue({
          data: [
            {
              id: "m1",
              name: "Alice Johnson",
              email: "alice@example.com",
              phone: "555-1234",
              eventDate: "2024-06-15",
              subject: "Wedding Flowers",
              message: "I need arrangements for my wedding",
              attachmentKey: "uploads/photo.jpg",
              createdAt: "2024-01-15T10:00:00Z",
            },
            {
              id: "m2",
              name: "Bob Smith",
              email: "bob@example.com",
              phone: null,
              eventDate: null,
              subject: "General Question",
              message: "Do you deliver on weekends?",
              attachmentKey: null,
              createdAt: "2024-01-16T10:00:00Z",
            },
          ],
        }),
      },
    },
  }),
}));

jest.mock("aws-amplify/storage", () => ({
  getUrl: jest.fn().mockResolvedValue({ url: new URL("https://example.com/photo.jpg") }),
}));

describe("AdminMessagesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders message table after loading", async () => {
    render(<AdminMessagesPage />);
    await waitFor(() => {
      expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    });
    expect(screen.getByText("Bob Smith")).toBeInTheDocument();
    expect(screen.getByText("Wedding Flowers")).toBeInTheDocument();
  });

  it("expands message details", async () => {
    render(<AdminMessagesPage />);
    await waitFor(() => {
      expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    });
    // Messages are sorted by date desc: Bob (Jan 16) first, Alice (Jan 15) second
    const expandButtons = screen.getAllByText("+");
    fireEvent.click(expandButtons[1]); // Alice is second
    expect(screen.getByText("I need arrangements for my wedding")).toBeInTheDocument();
  });

  it("shows phone and event date metadata", async () => {
    render(<AdminMessagesPage />);
    await waitFor(() => {
      expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    });
    const expandButtons = screen.getAllByText("+");
    fireEvent.click(expandButtons[1]); // Alice is second
    expect(screen.getByText("555-1234")).toBeInTheDocument();
    expect(screen.getByText("2024-06-15")).toBeInTheDocument();
  });

  it("shows attachment preview", async () => {
    render(<AdminMessagesPage />);
    await waitFor(() => {
      expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    });
    const expandButtons = screen.getAllByText("+");
    fireEvent.click(expandButtons[1]); // Alice is second
    await waitFor(() => {
      const img = screen.getByAltText("Attachment");
      expect(img).toBeInTheDocument();
    });
  });
});
