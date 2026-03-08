import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("home page loads with hero", async ({ page }) => {
    await page.goto("/");
    // Should have the Tuberose Floral branding
    await expect(page.locator("text=Tuberose Floral").first()).toBeVisible();
  });

  test("navigate to Shop page", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/shop"]');
    await expect(page).toHaveURL("/shop");
    await expect(page.locator("text=Shop").first()).toBeVisible();
  });

  test("navigate to About page", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/about"]');
    await expect(page).toHaveURL("/about");
  });

  test("navigate to Gallery page", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/gallery"]');
    await expect(page).toHaveURL("/gallery");
  });

  test("navigate to Contact page", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/contact"]');
    await expect(page).toHaveURL("/contact");
  });

  test("cart link is visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('a[href="/cart"]')).toBeVisible();
  });
});
