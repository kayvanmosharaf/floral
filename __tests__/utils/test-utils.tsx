import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { CartProvider } from "@/app/context/CartContext";

// Access global mocks set up in jest.setup.ts
const mockUseAuthenticator = (globalThis as Record<string, unknown>).__mockUseAuthenticator as jest.Mock;

/**
 * Set mock authentication state
 */
export function setMockAuthState(state: "authenticated" | "unauthenticated") {
  mockUseAuthenticator.mockReturnValue({
    authStatus: state,
    user: state === "authenticated"
      ? { username: "testuser", userId: "test-user-id" }
      : undefined,
    signOut: (globalThis as Record<string, unknown>).__mockSignOut as jest.Mock,
  });
}

/**
 * Set mock admin state by configuring fetchAuthSession
 */
export function setMockAdminState(isAdmin: boolean) {
  const { fetchAuthSession } = require("aws-amplify/auth");
  (fetchAuthSession as jest.Mock).mockResolvedValue({
    tokens: {
      accessToken: {
        payload: {
          "cognito:groups": isAdmin ? ["admin"] : [],
        },
      },
    },
  });
}

/**
 * Get mock Amplify data client
 */
export function getMockClient() {
  const { generateClient } = require("aws-amplify/data");
  return (generateClient as jest.Mock)();
}

/**
 * Wrapper component that provides CartProvider context
 */
function AllProviders({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

/**
 * Custom render that wraps in all providers
 */
function customRender(ui: React.ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return render(ui, { wrapper: AllProviders, ...options });
}

export * from "@testing-library/react";
export { customRender as render };
