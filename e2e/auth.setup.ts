import { test as setup } from "@playwright/test";

/**
 * Global auth setup for E2E tests.
 * Authenticates a test user and saves storage state for reuse across tests.
 *
 * Prerequisites:
 * - A test user must exist in your Cognito user pool
 * - Set TEST_USER_EMAIL and TEST_USER_PASSWORD environment variables
 *
 * If no credentials are provided, tests will interact with the auth UI directly.
 */

const TEST_EMAIL = process.env.TEST_USER_EMAIL || "";
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || "";
const STORAGE_STATE_PATH = "e2e/.auth/user.json";

setup("authenticate", async ({ page }) => {
  if (!TEST_EMAIL || !TEST_PASSWORD) {
    console.warn(
      "No TEST_USER_EMAIL/TEST_USER_PASSWORD set. Skipping auth setup. " +
      "Tests that require authentication will need to handle login manually."
    );
    return;
  }

  await page.goto("/");

  // Wait for Amplify Authenticator to load
  await page.waitForSelector('[data-amplify-authenticator]', { timeout: 10000 }).catch(() => {
    console.log("Authenticator not found - may already be authenticated");
  });

  // Fill in credentials
  const emailInput = page.locator('input[name="username"]');
  const passwordInput = page.locator('input[name="password"]');

  if (await emailInput.isVisible()) {
    await emailInput.fill(TEST_EMAIL);
    await passwordInput.fill(TEST_PASSWORD);
    await page.locator('button[type="submit"]').click();

    // Wait for authentication to complete
    await page.waitForURL("/", { timeout: 15000 });
  }

  // Save storage state
  await page.context().storageState({ path: STORAGE_STATE_PATH });
});
