import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("https://mountserrah-backoffice.codespace.id/login");
  await page.getByRole("textbox", { name: "Email" }).click();
  await page.getByRole("textbox", { name: "Email" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill("seerah@albirr.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("A8m!kR2#pLs");
  await page.getByRole("button", { name: "Log in" }).click();
  await page.getByRole("link", { name: "Competition" }).click();
  await page.getByRole("link", { name: "Create New" }).click();
  await page.locator(".w-full").first().click();
  await page.locator("body").setInputFiles("background 2.jpeg");
  await page.getByRole("textbox", { name: "Input Competition Name" }).click();
  await page
    .getByRole("textbox", { name: "Input Competition Name" })
    .fill("Race 201");
  await page.getByRole("textbox", { name: "Input Organizer" }).click();
  await page.getByRole("textbox", { name: "Input Organizer" }).fill("Raccer");
  await page
    .getByRole("textbox", { name: "Input Additional link outside" })
    .click();
  await page
    .getByRole("textbox", { name: "Input Additional link outside" })
    .fill("-");
  await page.getByRole("button", { name: "Pick a date" }).first().click();
  await page.getByRole("gridcell", { name: "5", exact: true }).click();
  await page.getByRole("button", { name: "Pick a date" }).click();
  await page.getByRole("gridcell", { name: "6", exact: true }).click();
  await page.locator(".ql-editor").click();
  await page.locator(".ql-editor").fill("check");
  await page.getByRole("button", { name: "Normal" }).click();
  await page
    .locator("#ql-picker-options-0")
    .getByRole("button", { name: "Normal" })
    .click();
  await page.getByRole("button", { name: "bold" }).click();
  await page.getByRole("button", { name: "italic" }).click();
  await page.getByRole("button", { name: "underline" }).click();
  await page.getByRole("button", { name: "strike" }).click();
  await page.locator(".ql-background > .ql-picker-label").click();
  await page.locator(".ql-picker-item.ql-primary").first().click();
  await page.locator(".ql-picker-label.ql-active").click();
  await page.locator("#ql-picker-options-1 > span:nth-child(2)").click();
  await page.locator(".ql-picker-label.ql-active").click();
  await page.locator("#ql-picker-options-1 > span:nth-child(4)").click();
  await page.locator(".ql-editor").click();
  await page.locator(".ql-editor").fill("check\n\nsad\n\nsad");
  await page.getByText("check").click();
  await page.getByText("checksadsad").press("ControlOrMeta+a");
  await page.getByRole("button", { name: "indent: +" }).click();
  await page.getByRole("button", { name: "align: justify" }).click();
  await page.getByRole("button", { name: "indent: -" }).click();
  await page.getByRole("button", { name: "indent: +" }).click();
  await page.getByRole("button", { name: "clean" }).click();
  await page.getByRole("button", { name: "align: center" }).click();
  await page.getByRole("button", { name: "list: bullet" }).click();
  await page.getByRole("button", { name: "list: ordered" }).click();
  await page.goto(
    "https://mountserrah-backoffice.codespace.id/competition/create",
  );
  await page.getByRole("button", { name: "Publish" }).click();
  await page.getByRole("button", { name: "Yes, Publish" }).click();
});
