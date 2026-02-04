## Example 1: Non-Auth Record (Feature Test)

When record is records-crx/master-description/search-description.record.ts:

--- pages/master-description/Description.page.ts ---
export class DescriptionPage {
constructor(page) { this.page = page; }

async openModule() {
await this.page.getByText("Master Data").click();
await this.page.getByRole("link", { name: "Description" }).click();
}
async search(term) {
await this.page.getByRole("textbox", { name: "Search" }).fill(term);
}
}

--- tests/smoke/master-description/description.spec.ts ---
import { test, expect } from "@playwright/test";
import { DescriptionPage } from "../../../pages/master-description/Description.page";

test("Smoke - Open Description and search", async ({ page }) => {
await page.goto("/");
const description = new DescriptionPage(page);

await description.openModule();
await description.search("301");

await expect(page).toHaveURL(/description/);
await expect(page.getByRole("textbox", { name: "Search" })).toHaveValue("301");
});

--- Selector Improvement Suggestions ---

- Add data-testid="menu-master-data" to Master Data
- Add data-testid="menu-description" to Description link
- Add data-testid="description-search" to Search textbox

## Example 2: Auth Record (Login Flow)

When record is records-crx/auth/login.record.ts with login flow:

--- pages/auth/Login.page.ts ---
import type { Page } from "@playwright/test";

export class LoginPage {
constructor(private page: Page) {}

async fillEmail(email: string) {
await this.page.getByRole("textbox", { name: "Email or User ID" }).fill(email);
}

async fillPassword(password: string) {
await this.page.getByRole("textbox", { name: "Password" }).fill(password);
}

async clickLogin() {
await this.page.getByRole("button", { name: "Login" }).click();
}

async login(email: string, password: string) {
await this.fillEmail(email);
await this.fillPassword(password);
await this.clickLogin();
}
}

--- tests/auth.setup.ts ---
import "dotenv/config";
import { chromium, type FullConfig } from "@playwright/test";
import { LoginPage } from "../pages/auth/Login.page";
import fs from "fs";
import path from "path";

async function globalSetup(config: FullConfig) {
const sessionsPath = ".auth/sessions.json";
const email = process.env.USER_EMAIL!;
const password = process.env.USER_PASSWORD!;

let sessions: Record<string, { cookies: any[]; origins: any[] }> = {};

if (fs.existsSync(sessionsPath)) {
sessions = JSON.parse(fs.readFileSync(sessionsPath, "utf-8"));
}

const needsLogin = !sessions[email] || isSessionExpired(sessions[email]);

if (needsLogin) {
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

await page.goto(config.projects[0].use.baseURL + "/auth/old-login");
const loginPage = new LoginPage(page);
await loginPage.login(email, password);

await page.getByRole("button", { name: "bill-icon" }).waitFor();

const storageState = await context.storageState();
sessions[email] = {
cookies: storageState.cookies,
origins: storageState.origins,
};

fs.mkdirSync(path.dirname(sessionsPath), { recursive: true });
fs.writeFileSync(sessionsPath, JSON.stringify(sessions, null, 2));

await browser.close();
}

fs.writeFileSync(".auth/user.json", JSON.stringify(sessions[email], null, 2));
}

function isSessionExpired(session: { cookies: any[] }) {
if (!session?.cookies) return true;
const now = new Date();
return session.cookies.some((cookie) => {
if (!cookie.expires) return false;
return new Date(cookie.expires * 1000) < now;
});
}

export default globalSetup;

--- tests/smoke/auth/login.spec.ts ---
import { test, expect } from "@playwright/test";
import fs from "fs";

test("Smoke - Login and verify session", async ({ browser }) => {
const sessions = JSON.parse(fs.readFileSync(".auth/sessions.json", "utf-8"));
const email = process.env.USER_EMAIL!;
const session = sessions[email];

const context = await browser.newContext();
await context.addCookies(session.cookies);
const page = await context.newPage();

await page.goto("/");

await expect(page.getByRole("button", { name: "bill-icon" })).toBeVisible();
await context.close();
});

--- Selector Improvement Suggestions ---

- Add data-testid="login-email" to Email or User ID textbox
- Add data-testid="login-password" to Password textbox
- Add data-testid="login-submit" to Login button
