import { test, expect } from "@playwright/test";
import fs from "fs";

test.describe("Login @smoke", () => {
  test("should verify login session is valid", async ({ page, context }) => {
    const sessionsPath = ".auth/sessions.json";
    const email = process.env.USER_EMAIL!;
    
    if (fs.existsSync(sessionsPath)) {
      const sessions = JSON.parse(fs.readFileSync(sessionsPath, "utf-8"));
      if (sessions[email]?.cookies) {
        await context.addCookies(sessions[email].cookies);
      }
    }

    await page.goto("/");
    
    // Assert: Not redirected to login page
    await expect(page).not.toHaveURL(/\/auth\/login/);
    
    // Assert: User is logged in (adjust selector based on your app)
    // Example: Check for user menu, dashboard, or logout button
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });
});
