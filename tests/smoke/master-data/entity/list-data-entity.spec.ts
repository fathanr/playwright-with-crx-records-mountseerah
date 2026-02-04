import { test, expect } from "@playwright/test";
import { EntityDistrictPage } from "../../../../pages/master-data/entity/EntityDistrict.page";

test.describe("List Entity District @smoke", () => {
  test("should open Entity District list", async ({ page }) => {
    await page.goto("/");

    const entityDistrictPage = new EntityDistrictPage(page);
    await entityDistrictPage.openModule();

    await expect(page.getByTestId("create-btn")).toBeVisible();
    await expect(page).toHaveURL(/entity-district/i);
  });
});
