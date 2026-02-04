import { test, expect } from "@playwright/test";
import { EntityDistrictPage } from "../../../../pages/master-data/entity/EntityDistrict.page";

test.describe("Search Entity District @smoke", () => {
  test("should search and select entity district", async ({ page }) => {
    await page.goto("/");

    const entityDistrictPage = new EntityDistrictPage(page);
    await entityDistrictPage.openModule();
    await entityDistrictPage.search("ASTRA");

    await expect(page.getByRole("textbox", { name: "Search" })).toHaveValue("ASTRA");
    await expect(page.getByRole("cell", { name: "ASTRA" }).first()).toBeVisible();

    await entityDistrictPage.clickFirstMatchingCell("ASTRA");
  });
});
