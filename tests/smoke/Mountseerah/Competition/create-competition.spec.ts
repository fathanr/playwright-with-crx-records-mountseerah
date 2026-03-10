import { test, expect } from "@playwright/test";
import fs from "fs";

const IMAGE_PATH = "/Users/dot/Documents/fathan/crx-playwright/records-crx/Mountseerah/Competition/image.jpeg";

async function fillAllFieldsExceptRichText(page: any, name: string, organizer: string) {
  await page.locator("input[type='file']").setInputFiles(IMAGE_PATH);
  await page.waitForTimeout(500);
  
  await page.getByRole("textbox", { name: /input competition name/i }).fill(name);
  await page.getByRole("textbox", { name: /input organizer/i }).fill(organizer);
  await page.getByRole("textbox", { name: /input additional link outside/i }).fill("-");
  await page.waitForTimeout(300);
  
  await page.getByRole("button", { name: /pick a date/i }).first().click();
  await page.getByRole("gridcell", { name: "5", exact: true }).click();
  await page.waitForTimeout(300);
  
  await page.getByRole("button", { name: /pick a date/i }).click();
  await page.getByRole("gridcell", { name: "10", exact: true }).first().click();
  await page.waitForTimeout(300);
}

async function publishCompetition(page: any) {
  await page.getByRole("button", { name: /publish/i }).click();
  await page.waitForTimeout(2000);
  
  const confirmButton = page.getByRole("button", { name: /yes, publish/i });
  if (await confirmButton.isVisible().catch(() => false)) {
    await confirmButton.click();
    await page.waitForTimeout(3000);
  }
}

test.describe("Create Competition @smoke", () => {
  test.beforeEach(async ({ page, context }) => {
    const sessionsPath = ".auth/sessions.json";
    const email = process.env.USER_EMAIL || "seerah@albirr.com";

    if (fs.existsSync(sessionsPath)) {
      const sessions = JSON.parse(fs.readFileSync(sessionsPath, "utf-8"));
      if (sessions[email]?.cookies) {
        await context.addCookies(sessions[email].cookies);
      }
    }
  });

  test("TC01: should create competition with all fields", async ({ page }) => {
    await page.goto("/competition/create");
    await page.waitForTimeout(1000);
    
    await fillAllFieldsExceptRichText(page, "Race 201", "Raccer");
    await page.locator(".ql-editor").fill("Test competition description");
    await page.waitForTimeout(300);
    
    await publishCompetition(page);
    
    await page.goto("/competition");
    await page.waitForTimeout(3000);
    
    await expect(page.getByText("Race 201").first()).toBeVisible({ timeout: 10000 });
  });

  // Rich Text Editor Tools Tests - Each creates formatted competition data

  test("TC02: should create competition with bold text", async ({ page }) => {
    await page.goto("/competition/create");
    await page.waitForTimeout(1000);
    
    await fillAllFieldsExceptRichText(page, "Bold Format", "Organizer");
    
    await page.locator(".ql-editor").click();
    await page.locator(".ql-editor").fill("Bold Text");
    await page.locator(".ql-editor").press("ControlOrMeta+a");
    await page.locator(".ql-bold").click();
    await page.waitForTimeout(500);
    
    await publishCompetition(page);
    
    await page.goto("/competition");
    await page.waitForTimeout(3000);
    await expect(page.getByText("Bold Format").first()).toBeVisible({ timeout: 10000 });
  });

  test("TC03: should create competition with italic text", async ({ page }) => {
    await page.goto("/competition/create");
    await page.waitForTimeout(1000);
    
    await fillAllFieldsExceptRichText(page, "Italic Format", "Organizer");
    
    await page.locator(".ql-editor").click();
    await page.locator(".ql-editor").fill("Italic Text");
    await page.locator(".ql-editor").press("ControlOrMeta+a");
    await page.locator(".ql-italic").click();
    await page.waitForTimeout(500);
    
    await publishCompetition(page);
    
    await page.goto("/competition");
    await page.waitForTimeout(3000);
    await expect(page.getByText("Italic Format").first()).toBeVisible({ timeout: 10000 });
  });

  test("TC04: should create competition with underline text", async ({ page }) => {
    await page.goto("/competition/create");
    await page.waitForTimeout(1000);
    
    await fillAllFieldsExceptRichText(page, "Underline Format", "Organizer");
    
    await page.locator(".ql-editor").click();
    await page.locator(".ql-editor").fill("Underline Text");
    await page.locator(".ql-editor").press("ControlOrMeta+a");
    await page.locator(".ql-underline").click();
    await page.waitForTimeout(500);
    
    await publishCompetition(page);
    
    await page.goto("/competition");
    await page.waitForTimeout(3000);
    await expect(page.getByText("Underline Format").first()).toBeVisible({ timeout: 10000 });
  });

  test("TC05: should create competition with strikethrough text", async ({ page }) => {
    await page.goto("/competition/create");
    await page.waitForTimeout(1000);
    
    await fillAllFieldsExceptRichText(page, "Strike Format", "Organizer");
    
    await page.locator(".ql-editor").click();
    await page.locator(".ql-editor").fill("Strikethrough Text");
    await page.locator(".ql-editor").press("ControlOrMeta+a");
    await page.locator(".ql-strike").click();
    await page.waitForTimeout(500);
    
    await publishCompetition(page);
    
    await page.goto("/competition");
    await page.waitForTimeout(3000);
    await expect(page.getByText("Strike Format").first()).toBeVisible({ timeout: 10000 });
  });

  test("TC06: should create competition with background color", async ({ page }) => {
    await page.goto("/competition/create");
    await page.waitForTimeout(1000);
    
    await fillAllFieldsExceptRichText(page, "Bg Black White Format", "Organizer");
    
    await page.locator(".ql-editor").click();
    await page.locator(".ql-editor").fill("White on Black");
    await page.waitForTimeout(300);
    
    // Select all text
    await page.locator(".ql-editor").press("ControlOrMeta+a");
    await page.waitForTimeout(300);
    
    // Apply black background - click the background color button (first one)
    await page.locator(".ql-background").first().click();
    await page.waitForTimeout(500);
    // Select black from picker 
    await page.locator("[data-value='#000000']").first().click();
    await page.waitForTimeout(300);
    
    // Now apply white text color
    await page.locator(".ql-editor").press("ControlOrMeta+a");
    await page.waitForTimeout(300);
    await page.locator(".ql-color").first().click();
    await page.waitForTimeout(500);
    // Select white from picker 
    await page.locator("[data-value='#ffffff']").first().click();
    await page.waitForTimeout(500);
    
    await publishCompetition(page);
    
    await page.goto("/competition");
    await page.waitForTimeout(3000);
    await expect(page.getByText("Bg Black White Format").first()).toBeVisible({ timeout: 10000 });
  });

  test("TC07: should create competition with text color", async ({ page }) => {
    await page.goto("/competition/create");
    await page.waitForTimeout(1000);
    
    await fillAllFieldsExceptRichText(page, "Text Red Format", "Organizer");
    
    await page.locator(".ql-editor").click();
    await page.locator(".ql-editor").fill("Text Color Text");
    await page.locator(".ql-editor").press("ControlOrMeta+a");
    await page.waitForTimeout(300);
    
    // Open text color picker - click on the span element
    await page.locator(".ql-color > .ql-picker-label").click();
    await page.waitForTimeout(500);
    // Select red color - look for the red color option
    await page.locator(".ql-picker-options:not([aria-hidden='true']) .ql-picker-item[data-value='#e60000']").click({ force: true });
    await page.waitForTimeout(500);
    
    await publishCompetition(page);
    
    await page.goto("/competition");
    await page.waitForTimeout(3000);
    await expect(page.getByText("Text Red Format").first()).toBeVisible({ timeout: 10000 });
  });

  test("TC08: should create competition with bullet list", async ({ page }) => {
    await page.goto("/competition/create");
    await page.waitForTimeout(1000);
    
    await fillAllFieldsExceptRichText(page, "Bullet List Format", "Organizer");
    
    await page.locator(".ql-editor").click();
    await page.locator(".ql-editor").fill("Item 1");
    await page.locator(".ql-editor").press("ControlOrMeta+a");
    await page.waitForTimeout(300);
    await page.locator('.ql-list[value="bullet"]').click();
    await page.waitForTimeout(500);
    
    await publishCompetition(page);
    
    await page.goto("/competition");
    await page.waitForTimeout(3000);
    await expect(page.getByText("Bullet List Format").first()).toBeVisible({ timeout: 10000 });
  });

  test("TC09: should create competition with ordered list", async ({ page }) => {
    await page.goto("/competition/create");
    await page.waitForTimeout(1000);
    
    await fillAllFieldsExceptRichText(page, "Ordered List Format", "Organizer");
    
    await page.locator(".ql-editor").click();
    await page.locator(".ql-editor").fill("First");
    await page.locator(".ql-editor").press("ControlOrMeta+a");
    await page.waitForTimeout(300);
    await page.locator('.ql-list[value="ordered"]').click();
    await page.waitForTimeout(500);
    
    await publishCompetition(page);
    
    await page.goto("/competition");
    await page.waitForTimeout(3000);
    await expect(page.getByText("Ordered List Format").first()).toBeVisible({ timeout: 10000 });
  });

  test("TC10: should create competition with align left", async ({ page }) => {
    await page.goto("/competition/create");
    await page.waitForTimeout(1000);
    
    await fillAllFieldsExceptRichText(page, "Align Left Format", "Organizer");
    
    await page.locator(".ql-editor").click();
    await page.locator(".ql-editor").fill("Left Aligned");
    await page.locator(".ql-editor").press("ControlOrMeta+a");
    await page.waitForTimeout(300);
    await page.locator('.ql-align[value=""]').click();
    await page.waitForTimeout(500);
    
    await publishCompetition(page);
    
    await page.goto("/competition");
    await page.waitForTimeout(3000);
    await expect(page.getByText("Align Left Format").first()).toBeVisible({ timeout: 10000 });
  });

  test("TC11: should create competition with align center", async ({ page }) => {
    await page.goto("/competition/create");
    await page.waitForTimeout(1000);
    
    await fillAllFieldsExceptRichText(page, "Align Center Format", "Organizer");
    
    await page.locator(".ql-editor").click();
    await page.locator(".ql-editor").fill("Center Aligned");
    await page.locator(".ql-editor").press("ControlOrMeta+a");
    await page.waitForTimeout(300);
    await page.locator('.ql-align[value="center"]').click();
    await page.waitForTimeout(500);
    
    await publishCompetition(page);
    
    await page.goto("/competition");
    await page.waitForTimeout(3000);
    await expect(page.getByText("Align Center Format").first()).toBeVisible({ timeout: 10000 });
  });

  test("TC12: should create competition with align right", async ({ page }) => {
    await page.goto("/competition/create");
    await page.waitForTimeout(1000);
    
    await fillAllFieldsExceptRichText(page, "Align Right Format", "Organizer");
    
    await page.locator(".ql-editor").click();
    await page.locator(".ql-editor").fill("Right Aligned");
    await page.locator(".ql-editor").press("ControlOrMeta+a");
    await page.waitForTimeout(300);
    await page.locator('.ql-align[value="right"]').click();
    await page.waitForTimeout(500);
    
    await publishCompetition(page);
    
    await page.goto("/competition");
    await page.waitForTimeout(3000);
    await expect(page.getByText("Align Right Format").first()).toBeVisible({ timeout: 10000 });
  });

  test("TC13: should create competition with align justify", async ({ page }) => {
    await page.goto("/competition/create");
    await page.waitForTimeout(1000);
    
    await fillAllFieldsExceptRichText(page, "Align Justify Format", "Organizer");
    
    await page.locator(".ql-editor").click();
    await page.locator(".ql-editor").fill("Justified Text");
    await page.locator(".ql-editor").press("ControlOrMeta+a");
    await page.waitForTimeout(300);
    await page.locator('.ql-align[value="justify"]').click();
    await page.waitForTimeout(500);
    
    await publishCompetition(page);
    
    await page.goto("/competition");
    await page.waitForTimeout(3000);
    await expect(page.getByText("Align Justify Format").first()).toBeVisible({ timeout: 10000 });
  });

  test("TC14: should create competition with indent increase", async ({ page }) => {
    await page.goto("/competition/create");
    await page.waitForTimeout(1000);
    
    await fillAllFieldsExceptRichText(page, "Indent Plus Format", "Organizer");
    
    await page.locator(".ql-editor").click();
    await page.locator(".ql-editor").fill("Indented Text");
    await page.locator(".ql-editor").press("ControlOrMeta+a");
    await page.waitForTimeout(300);
    await page.locator('.ql-indent[value="+1"]').click();
    await page.waitForTimeout(500);
    
    await publishCompetition(page);
    
    await page.goto("/competition");
    await page.waitForTimeout(3000);
    await expect(page.getByText("Indent Plus Format").first()).toBeVisible({ timeout: 10000 });
  });

  test("TC15: should create competition with indent decrease", async ({ page }) => {
    await page.goto("/competition/create");
    await page.waitForTimeout(1000);
    
    await fillAllFieldsExceptRichText(page, "Indent Minus Format", "Organizer");
    
    await page.locator(".ql-editor").click();
    await page.locator(".ql-editor").fill("Text");
    await page.locator(".ql-editor").press("ControlOrMeta+a");
    await page.waitForTimeout(300);
    await page.locator('.ql-indent[value="+1"]').click();
    await page.waitForTimeout(300);
    await page.locator('.ql-indent[value="-1"]').click();
    await page.waitForTimeout(500);
    
    await publishCompetition(page);
    
    await page.goto("/competition");
    await page.waitForTimeout(3000);
    await expect(page.getByText("Indent Minus Format").first()).toBeVisible({ timeout: 10000 });
  });

  test("TC16: should create competition with clean format", async ({ page }) => {
    await page.goto("/competition/create");
    await page.waitForTimeout(1000);
    
    await fillAllFieldsExceptRichText(page, "Clean Format", "Organizer");
    
    await page.locator(".ql-editor").click();
    await page.locator(".ql-editor").fill("Cleaned Text");
    await page.waitForTimeout(300);
    
    await publishCompetition(page);
    
    await page.goto("/competition");
    await page.waitForTimeout(3000);
    await expect(page.getByText("Clean Format").first()).toBeVisible({ timeout: 10000 });
  });

  test("TC17: should create competition with special characters", async ({ page }) => {
    await page.goto("/competition/create");
    await page.waitForTimeout(1000);
    
    await fillAllFieldsExceptRichText(page, "Special Chars", "Organizer");
    await page.locator(".ql-editor").fill("Special @#$%^&*() Characters!");
    await page.waitForTimeout(300);
    
    await publishCompetition(page);
    
    await page.goto("/competition");
    await page.waitForTimeout(3000);
    await expect(page.getByText("Special Chars").first()).toBeVisible({ timeout: 10000 });
  });

  test("TC18: should create competition with Unicode", async ({ page }) => {
    await page.goto("/competition/create");
    await page.waitForTimeout(1000);
    
    await fillAllFieldsExceptRichText(page, "Unicode Test", "Organizer");
    await page.locator(".ql-editor").fill("Emojis");
    await page.waitForTimeout(300);
    
    await publishCompetition(page);
    
    await page.goto("/competition");
    await page.waitForTimeout(3000);
    await expect(page.getByText("Unicode Test").first()).toBeVisible({ timeout: 10000 });
  });

  test("TC19: should create competition with newlines", async ({ page }) => {
    await page.goto("/competition/create");
    await page.waitForTimeout(1000);
    
    await fillAllFieldsExceptRichText(page, "Newlines Test", "Organizer");
    await page.locator(".ql-editor").fill("Line 1");
    await page.locator(".ql-editor").press("Shift+Enter");
    await page.waitForTimeout(200);
    await page.keyboard.type("Line 2");
    await page.waitForTimeout(300);
    
    await publishCompetition(page);
    
    await page.goto("/competition");
    await page.waitForTimeout(3000);
    await expect(page.getByText("Newlines Test").first()).toBeVisible({ timeout: 10000 });
  });

  test("TC20: should handle SQL injection attempt", async ({ page }) => {
    await page.goto("/competition/create");
    await page.waitForTimeout(1000);
    
    await fillAllFieldsExceptRichText(page, "SQL Injection", "'; DROP TABLE competitions; --");
    await page.locator(".ql-editor").fill("Test description");
    await page.waitForTimeout(300);
    
    await publishCompetition(page);
    
    await page.goto("/competition");
    await page.waitForTimeout(3000);
    await expect(page.getByText("SQL Injection").first()).toBeVisible({ timeout: 10000 });
  });

  test("TC21: should handle XSS attempt", async ({ page }) => {
    await page.goto("/competition/create");
    await page.waitForTimeout(1000);
    
    await fillAllFieldsExceptRichText(page, "XSS Test", "Test");
    await page.locator(".ql-editor").fill("Description");
    await page.waitForTimeout(300);
    
    await publishCompetition(page);
    
    await page.goto("/competition");
    await page.waitForTimeout(3000);
    await expect(page.getByText("XSS Test").first()).toBeVisible({ timeout: 10000 });
  });

  test("TC22: should prevent double-click on publish", async ({ page }) => {
    await page.goto("/competition/create");
    await page.waitForTimeout(1000);
    
    await fillAllFieldsExceptRichText(page, "Double Click Test", "Organizer");
    await page.locator(".ql-editor").fill("Test description");
    await page.waitForTimeout(300);
    
    await page.getByRole("button", { name: /publish/i }).dblclick();
    await page.waitForTimeout(2000);
    
    const confirmButton = page.getByRole("button", { name: /yes, publish/i });
    if (await confirmButton.isVisible().catch(() => false)) {
      await confirmButton.click();
      await page.waitForTimeout(3000);
    }
    
    await page.goto("/competition");
    await page.waitForTimeout(3000);
    await expect(page.getByText("Double Click Test").first()).toBeVisible({ timeout: 10000 });
  });

  // Comprehensive test - All formatting tools in one competition
  test("TC23: should create competition with all formatting applied", async ({ page }) => {
    await page.goto("/competition/create");
    await page.waitForTimeout(1000);
    
    await fillAllFieldsExceptRichText(page, "All Format Test", "Organizer");
    
    await page.locator(".ql-editor").click();
    await page.waitForTimeout(300);
    
    // Section 1: Bold
    await page.keyboard.type("BoldText");
    await page.keyboard.press("Shift+Control+ArrowLeft");
    await page.locator(".ql-bold").click();
    await page.keyboard.press("Control+ArrowRight");
    await page.waitForTimeout(200);
    
    // Section 2: Italic
    await page.keyboard.press("Enter");
    await page.waitForTimeout(100);
    await page.keyboard.type("ItalicText");
    await page.keyboard.press("Shift+Control+ArrowLeft");
    await page.locator(".ql-italic").click();
    await page.keyboard.press("Control+ArrowRight");
    await page.waitForTimeout(200);
    
    // Section 3: Underline
    await page.keyboard.press("Enter");
    await page.waitForTimeout(100);
    await page.keyboard.type("UnderlineText");
    await page.keyboard.press("Shift+Control+ArrowLeft");
    await page.locator(".ql-underline").click();
    await page.keyboard.press("Control+ArrowRight");
    await page.waitForTimeout(200);
    
    // Section 4: Strike
    await page.keyboard.press("Enter");
    await page.waitForTimeout(100);
    await page.keyboard.type("StrikeText");
    await page.keyboard.press("Shift+Control+ArrowLeft");
    await page.locator(".ql-strike").click();
    await page.keyboard.press("Control+ArrowRight");
    await page.waitForTimeout(200);
    
    // Section 5: Background Color (black)
    await page.keyboard.press("Enter");
    await page.waitForTimeout(100);
    await page.keyboard.type("BackgroundBlack");
    await page.keyboard.press("Shift+Control+ArrowLeft");
    await page.locator(".ql-background").first().click();
    await page.waitForTimeout(200);
    await page.locator("[data-value='#000000']").first().click();
    await page.keyboard.press("Control+ArrowRight");
    await page.waitForTimeout(200);
    
    // Section 6: Normal text
    await page.keyboard.press("Enter");
    await page.waitForTimeout(100);
    await page.keyboard.type("NormalText");
    await page.keyboard.press("Control+ArrowRight");
    await page.waitForTimeout(200);
    
    // Section 7: Bullet List
    await page.keyboard.press("Enter");
    await page.waitForTimeout(100);
    await page.keyboard.type("FirstBullet");
    await page.keyboard.press("Shift+Control+ArrowLeft");
    await page.locator('.ql-list[value="bullet"]').click();
    await page.keyboard.press("Control+ArrowRight");
    await page.waitForTimeout(200);
    await page.keyboard.press("Enter");
    await page.keyboard.type("SecondBullet");
    await page.keyboard.press("Control+ArrowRight");
    await page.waitForTimeout(200);
    
    // Section 8: Ordered List
    await page.keyboard.press("Enter");
    await page.waitForTimeout(100);
    await page.keyboard.type("FirstNumber");
    await page.keyboard.press("Shift+Control+ArrowLeft");
    await page.locator('.ql-list[value="ordered"]').click();
    await page.keyboard.press("Control+ArrowRight");
    await page.waitForTimeout(200);
    await page.keyboard.press("Enter");
    await page.keyboard.type("SecondNumber");
    await page.keyboard.press("Control+ArrowRight");
    await page.waitForTimeout(200);
    
    // Section 9: Align Center
    await page.keyboard.press("Enter");
    await page.waitForTimeout(100);
    await page.keyboard.type("CenterText");
    await page.keyboard.press("Shift+Control+ArrowLeft");
    await page.locator('.ql-align[value="center"]').click();
    await page.keyboard.press("Control+ArrowRight");
    await page.waitForTimeout(200);
    
    // Section 10: Align Right
    await page.keyboard.press("Enter");
    await page.waitForTimeout(100);
    await page.keyboard.type("RightText");
    await page.keyboard.press("Shift+Control+ArrowLeft");
    await page.locator('.ql-align[value="right"]').click();
    await page.keyboard.press("Control+ArrowRight");
    await page.waitForTimeout(200);
    
    // Section 11: Indent
    await page.keyboard.press("Enter");
    await page.waitForTimeout(100);
    await page.keyboard.type("IndentedText");
    await page.keyboard.press("Shift+Control+ArrowLeft");
    await page.locator('.ql-indent[value="+1"]').click();
    await page.waitForTimeout(200);
    
    // Section 12: Font Color (red)
    await page.keyboard.press("Enter");
    await page.waitForTimeout(100);
    await page.keyboard.type("FontRed");
    await page.keyboard.press("Shift+Control+ArrowLeft");
    await page.locator(".ql-color").first().click();
    await page.waitForTimeout(200);
    await page.locator("[data-value='#e60000']").first().click();
    await page.keyboard.press("Control+ArrowRight");
    await page.waitForTimeout(200);
    
    // Section 13: Font Size (large)
    await page.keyboard.press("Enter");
    await page.waitForTimeout(100);
    await page.keyboard.type("FontLarge");
    await page.keyboard.press("Shift+Control+ArrowLeft");
    await page.locator(".ql-size").first().click();
    await page.waitForTimeout(200);
    await page.locator("[data-value='large']").click();
    await page.waitForTimeout(200);
    
    await publishCompetition(page);
    
    await page.goto("/competition");
    await page.waitForTimeout(3000);
    await expect(page.getByText("All Format Test").first()).toBeVisible({ timeout: 10000 });
  });
});
