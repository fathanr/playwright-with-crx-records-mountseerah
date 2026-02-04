import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("https://pamafix-dev.dot.co.id/auth/old-login");
  await page.getByRole("textbox", { name: "Email or User ID" }).click();
  await page
    .getByRole("textbox", { name: "Email or User ID" })
    .fill("admin@dot.co.id");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("rahasia123!");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("button", { name: "MR bill-icon" }).click();
  await page.getByRole("button", { name: "user admin mr" }).click();
  await page.getByRole("button", { name: "OK" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^Dashboard$/ })
    .first()
    .click();
});
