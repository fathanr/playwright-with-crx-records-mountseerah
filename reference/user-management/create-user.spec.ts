/**
 * Create User Test Cases - AI Reference
 * 
 * Pattern: CRUD Operation with Session Management
 * 
 * Test Cases:
 * 1. Navigate to create user page
 * 2. Create new user successfully
 * 3. Validate user appears in table
 */

import { test, expect } from "@playwright/test";
import { CreateUserPage } from "../../../pages/user-management/CreateUser.page";

test.describe("User Management - Create User @smoke", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("TC01: should navigate to create user page", async ({ page }) => {
    const createUserPage = new CreateUserPage(page);
    await createUserPage.navigateToCreateUser();

    expect(createUserPage.nameInput).toBeVisible();
    expect(createUserPage.emailInput).toBeVisible();
  });

  test("TC02: should create user successfully", async ({ page }) => {
    const createUserPage = new CreateUserPage(page);
    await createUserPage.createUser("John Doe", "john.doe@test.com", "Admin");

    const successMsg = await createUserPage.getSuccessMessage();
    expect(successMsg).toMatch(/success|created|saved/i);
  });

  test("TC03: should show new user in table", async ({ page }) => {
    const createUserPage = new CreateUserPage(page);
    await createUserPage.createUser("John Doe", "john.doe@test.com", "Admin");

    const isCreated = await createUserPage.isUserCreated("John Doe");
    expect(isCreated).toBe(true);
  });
});
