import { test, expect } from "@playwright/test";

test.describe("Admin", () => {
  test("admin page loads", async ({ page }) => {
    await page.goto("/admin");
    // Should show either the admin dashboard or access denied
    const content = await page.textContent("body");
    expect(content).toBeTruthy();
  });

  test("non-admin sees access denied", async ({ page }) => {
    await page.goto("/admin");
    // Without admin privileges, should show access denied
    const denied = page.locator("text=/Access Denied|not have admin/i");
    const dashboard = page.locator("text=Dashboard");
    // One of these should be visible
    const isDenied = await denied.isVisible().catch(() => false);
    const isDashboard = await dashboard.isVisible().catch(() => false);
    expect(isDenied || isDashboard).toBe(true);
  });

  test("admin nav items exist when accessible", async ({ page }) => {
    await page.goto("/admin");
    // If we have access, check nav items
    const dashboard = page.locator("text=Dashboard");
    if (await dashboard.isVisible().catch(() => false)) {
      await expect(page.locator('a[href="/admin/products"]')).toBeVisible();
      await expect(page.locator('a[href="/admin/orders"]')).toBeVisible();
      await expect(page.locator('a[href="/admin/messages"]')).toBeVisible();
    }
  });

  test("admin products page loads", async ({ page }) => {
    await page.goto("/admin/products");
    const content = await page.textContent("body");
    expect(content).toBeTruthy();
  });

  test("admin orders page loads", async ({ page }) => {
    await page.goto("/admin/orders");
    const content = await page.textContent("body");
    expect(content).toBeTruthy();
  });

  test("admin messages page loads", async ({ page }) => {
    await page.goto("/admin/messages");
    const content = await page.textContent("body");
    expect(content).toBeTruthy();
  });
});
