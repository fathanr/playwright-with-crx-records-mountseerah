import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.getByText("Master Data").click();
  await page.getByRole("link", { name: "Entity District" }).click();
  await page.getByRole("textbox", { name: "Search" }).click();
  await page.getByRole("textbox", { name: "Search" }).fill("ASTRA");
  await page.locator(".ant-spin-dot").click();
  await page.getByRole("cell", { name: "ASTRA" }).first().click();
});
