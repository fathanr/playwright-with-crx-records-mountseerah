import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.getByText("Master Data").click();
  await page.getByRole("link", { name: "Entity District" }).click();
});
