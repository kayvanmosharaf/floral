import { test, expect } from "@playwright/test";

test.describe("Shop", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/shop");
  });

  test("products load and display", async ({ page }) => {
    // Wait for product cards to appear
    await expect(page.locator("text=Shop").first()).toBeVisible();
    // Check that at least one product card is rendered
    const addButtons = page.locator("text=+ Add to Cart");
    await expect(addButtons.first()).toBeVisible();
  });

  test("category filter buttons are visible", async ({ page }) => {
    await expect(page.locator("button:text('All')")).toBeVisible();
    await expect(page.locator("button:text('Bouquets')")).toBeVisible();
    await expect(page.locator("button:text('Weddings')")).toBeVisible();
  });

  test("category filtering works", async ({ page }) => {
    // Count total products first
    const allButtons = await page.locator("text=+ Add to Cart").count();
    // Click a category filter
    await page.click("button:text('Bouquets')");
    // Should have fewer or equal products
    const filteredButtons = await page.locator("text=+ Add to Cart").count();
    expect(filteredButtons).toBeLessThanOrEqual(allButtons);
  });

  test("add to cart updates cart badge", async ({ page }) => {
    // Click the first Add to Cart button
    await page.locator("text=+ Add to Cart").first().click();
    // The button should change to "Added"
    await expect(page.locator("text=Added").first()).toBeVisible();
    // Cart badge should show a count
    const badge = page.locator('a[href="/cart"] span');
    await expect(badge).toBeVisible();
  });

  test("product cards show prices", async ({ page }) => {
    // Products should display prices with $
    await expect(page.locator("text=/\\$\\d+/").first()).toBeVisible();
  });
});
