import { test, expect } from "@playwright/test";
import fs from "fs";

test.describe("Login @smoke", () => {
  test("should login admin MR successfully", async ({ page, context }) => {
    const sessionsPath = ".auth/sessions.json";
    const email = process.env.USER_EMAIL || "admin@dot.co.id";
    
    if (fs.existsSync(sessionsPath)) {
      const sessions = JSON.parse(fs.readFileSync(sessionsPath, "utf-8"));
      if (sessions[email]?.cookies) {
        await context.addCookies(sessions[email].cookies);
      }
    }

    await page.goto("/");
    
    await expect(page).not.toHaveURL(/\/auth\/(old-)?login/);
    await expect(page.locator("div").filter({ hasText: /^Dashboard$/ }).first()).toBeVisible();
  });
});
