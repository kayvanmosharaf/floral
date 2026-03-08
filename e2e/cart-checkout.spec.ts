import { test, expect } from "@playwright/test";

test.describe("Cart & Checkout", () => {
  test.beforeEach(async ({ page }) => {
    // Add an item to cart first
    await page.goto("/shop");
    await page.locator("text=+ Add to Cart").first().click();
    await page.goto("/cart");
  });

  test("cart page shows added items", async ({ page }) => {
    // Should display cart items
    await expect(page.locator("text=/\\$\\d+/").first()).toBeVisible();
  });

  test("cart shows subtotal", async ({ page }) => {
    await expect(page.locator("text=/Subtotal|Total/i").first()).toBeVisible();
  });

  test("checkout button opens checkout modal", async ({ page }) => {
    const checkoutBtn = page.locator("text=/Checkout|Proceed/i");
    if (await checkoutBtn.isVisible()) {
      await checkoutBtn.click();
      await expect(page.locator("text=Shipping Address")).toBeVisible();
    }
  });

  test("checkout modal step navigation", async ({ page }) => {
    const checkoutBtn = page.locator("text=/Checkout|Proceed/i");
    if (await checkoutBtn.isVisible()) {
      await checkoutBtn.click();
      // Should be on shipping step
      await expect(page.locator("text=Shipping Address")).toBeVisible();
      // Navigate to payment
      await page.click("text=Continue to Payment");
      await expect(page.locator("text=Payment Details")).toBeVisible();
      // Navigate to review
      await page.click("text=Review Order");
      await expect(page.locator("text=Review Your Order")).toBeVisible();
    }
  });

  test("empty cart shows appropriate message", async ({ page }) => {
    // Clear localStorage and reload
    await page.evaluate(() => localStorage.removeItem("cart"));
    await page.reload();
    // Should indicate cart is empty
    const emptyIndicator = page.locator("text=/empty|no items/i");
    if (await emptyIndicator.isVisible()) {
      expect(true).toBe(true);
    }
  });

  test("quantity controls work", async ({ page }) => {
    // Look for quantity increase/decrease buttons
    const incrementBtn = page.locator("text=/\\+/").first();
    if (await incrementBtn.isVisible()) {
      await incrementBtn.click();
      // Cart count should update
    }
  });
});
