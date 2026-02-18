import { test, expect } from "@playwright/test";
import fs from "fs";
import { LoginPage } from "../../../pages/auth/Login.page";
import { TEST_USERS, ERROR_MESSAGES } from "../../../utils/testData";

/**
 * Login Test Suite
 * Adapted from learn-pw pattern with Arrange/Act/Assert structure
 * 
 * Test Cases:
 * 1. Valid login - session is valid, user logged in
 * 2. Invalid email - error message shown
 * 3. Invalid password - error message shown
 * 4. Empty email - validation error
 * 5. Empty password - validation error
 * 6. Login button is enabled
 * 7. Login form elements are visible
 */

test.describe("Login @smoke", () => {
  // Load session for all tests
  test.beforeEach(async ({ page, context }) => {
    const sessionsPath = ".auth/sessions.json";
    const email = process.env.USER_EMAIL || TEST_USERS.VALID.email;
    
    if (fs.existsSync(sessionsPath)) {
      const sessions = JSON.parse(fs.readFileSync(sessionsPath, "utf-8"));
      if (sessions[email]?.cookies) {
        await context.addCookies(sessions[email].cookies);
      }
    }
  });

  /**
   * Test Case 1: Valid Login Session
   * Verify user is logged in with valid session
   */
  test("TC01: should verify login session is valid", async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    
    // Act
    await page.goto("/");
    
    // Assert
    await expect(page).not.toHaveURL(/\/auth\/login/);
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  /**
   * Test Case 2: Invalid Email
   * Verify error message when using invalid email
   */
  test("TC02: should show error with invalid email", async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    
    // Act
    await page.goto("/auth/login");
    await loginPage.login(TEST_USERS.INVALID_EMAIL.email, TEST_USERS.INVALID_EMAIL.password);
    
    // Assert
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toMatch(ERROR_MESSAGES.INVALID_CREDENTIALS);
    expect(page.url()).toContain('/auth/login');
  });

  /**
   * Test Case 3: Invalid Password
   * Verify error message when using invalid password
   */
  test("TC03: should show error with invalid password", async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    
    // Act
    await page.goto("/auth/login");
    await loginPage.login(TEST_USERS.INVALID_PASSWORD.email, TEST_USERS.INVALID_PASSWORD.password);
    
    // Assert
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toMatch(ERROR_MESSAGES.INVALID_CREDENTIALS);
    expect(page.url()).toContain('/auth/login');
  });

  /**
   * Test Case 4: Empty Email
   * Verify validation error when email is empty
   */
  test("TC04: should show error when email is empty", async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    
    // Act
    await page.goto("/auth/login");
    await loginPage.login(TEST_USERS.EMPTY_EMAIL.email, TEST_USERS.EMPTY_EMAIL.password);
    
    // Assert
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toMatch(ERROR_MESSAGES.EMPTY_EMAIL);
  });

  /**
   * Test Case 5: Empty Password
   * Verify validation error when password is empty
   */
  test("TC05: should show error when password is empty", async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    
    // Act
    await page.goto("/auth/login");
    await loginPage.login(TEST_USERS.EMPTY_PASSWORD.email, TEST_USERS.EMPTY_PASSWORD.password);
    
    // Assert
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toMatch(ERROR_MESSAGES.EMPTY_PASSWORD);
  });

  /**
   * Test Case 6: Login Button State
   * Verify login button is enabled and visible
   */
  test("TC06: should have enabled login button", async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    
    // Act
    await page.goto("/auth/login");
    
    // Assert
    await expect(loginPage.loginButton).toBeEnabled();
    await expect(loginPage.loginButton).toBeVisible();
  });

  /**
   * Test Case 7: Login Form Elements
   * Verify all login form elements are visible
   */
  test("TC07: should display all login form elements", async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    
    // Act
    await page.goto("/auth/login");
    
    // Assert
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });
});
