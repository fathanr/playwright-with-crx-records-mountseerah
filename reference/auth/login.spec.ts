/**
 * Login Test Cases - AI Reference
 * 
 * Pattern: Auth Flow with Session Management
 * 
 * Test Cases:
 * 1. Valid login - session is valid
 * 2. Invalid email - error message shown
 * 3. Invalid password - error message shown
 * 4. Empty email - validation error
 * 5. Empty password - validation error
 */

import { test, expect } from "@playwright/test";
import fs from "fs";
import { LoginPage } from "../../../pages/auth/Login.page";

test.describe("Login @smoke", () => {
  test.beforeEach(async ({ page, context }) => {
    const sessionsPath = ".auth/sessions.json";
    const email = process.env.USER_EMAIL || "admin@dot.co.id";

    if (fs.existsSync(sessionsPath)) {
      const sessions = JSON.parse(fs.readFileSync(sessionsPath, "utf-8"));
      if (sessions[email]?.cookies) {
        await context.addCookies(sessions[email].cookies);
      }
    }
  });

  test("TC01: should login successfully with valid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto("/auth/login");
    await loginPage.login("admin@dot.co.id", "password123");

    expect(page.url()).not.toContain("/auth/login");
    expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
  });

  test("TC02: should show error with invalid email", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto("/auth/login");
    await loginPage.login("invalid@test.com", "password123");

    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toMatch(/invalid|wrong|incorrect/i);
  });

  test("TC03: should show error with invalid password", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto("/auth/login");
    await loginPage.login("admin@dot.co.id", "wrongpassword");

    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toMatch(/invalid|wrong|incorrect/i);
  });

  test("TC04: should show error when email is empty", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto("/auth/login");
    await loginPage.login("", "password123");

    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toMatch(/email is required|username is required/i);
  });

  test("TC05: should show error when password is empty", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto("/auth/login");
    await loginPage.login("admin@dot.co.id", "");

    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toMatch(/password is required/i);
  });
});
