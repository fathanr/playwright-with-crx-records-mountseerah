import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.getByRole("menu").getByText("Master Data").click();
  await page.getByRole("link", { name: "Description", exact: true }).click();
  await page.getByRole("link", { name: "002" }).locator("a").click();
  await page.getByTestId("add-row-btn").click();
  await page.getByTestId("add-row-id-input").click();
  await page.getByTestId("add-row-id-input").fill("A199");
  await page.getByTestId("add-entity-district-select").locator("div").click();
  await page.getByTitle("KPP - KPP").click();
  await page.getByTestId("add-description-input").click();
  await page.getByTestId("add-description-input").fill("deskripsi a");
  await page.getByTestId("add-sub-description-input").click();
  await page.getByTestId("add-sub-description-input").fill("sub deskripsi a");
  await page.getByTestId("add-submit-btn").click();
  await page.getByText("Success add new row").click();
  await page.getByTestId("add-row-btn").click();
  await page.getByTestId("add-row-id-input").click();
  await page.getByTestId("add-row-id-input").fill("A1999");
  await page.getByTestId("add-entity-district-select").locator("div").click();
  await page.getByTitle("KPP - KPP").click();
  await page.getByTestId("add-description-input").click();
  await page.getByTestId("add-description-input").fill("deskripsi b");
  await page.getByTestId("add-sub-description-input").click();
  await page.getByTestId("add-sub-description-input").fill("sub deskripsi c");
  await page
    .getByTestId("add-is-parent-select")
    .getByText("Yes (Parent Row)")
    .click();
  await page.getByTitle("No (Child Row)").click();

  await page.getByTestId("add-parent-row-select").locator("div").click();
  await page.getByText("A199 - deskripsi a").click();
  await page.getByTestId("add-submit-btn").click();
  await page.getByText("Success add new row").click();
});
