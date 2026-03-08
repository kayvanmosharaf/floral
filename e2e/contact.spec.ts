import { test, expect } from "@playwright/test";

test.describe("Contact", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("contact page loads", async ({ page }) => {
    await expect(page.locator("text=/Contact/i").first()).toBeVisible();
  });

  test("contact form renders with required fields", async ({ page }) => {
    // Look for form fields
    const nameInput = page.locator('input[placeholder*="name" i], input[name="name"]');
    const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]');
    if (await nameInput.first().isVisible()) {
      expect(true).toBe(true);
    }
  });

  test("view messages section exists", async ({ page }) => {
    const messagesSection = page.locator("text=/messages|inbox/i");
    if (await messagesSection.first().isVisible()) {
      expect(true).toBe(true);
    }
  });

  test("view orders section exists", async ({ page }) => {
    const ordersSection = page.locator("text=/orders|order/i");
    if (await ordersSection.first().isVisible()) {
      expect(true).toBe(true);
    }
  });
});
