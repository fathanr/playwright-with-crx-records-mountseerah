import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("https://example.com/auth/login");
  await page.getByRole("textbox", { name: "Email" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill("user@example.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("password123");
  await page.getByRole("button", { name: "Login" }).click();
  
  // Wait for successful login
  await page.waitForURL("**/dashboard");
});
