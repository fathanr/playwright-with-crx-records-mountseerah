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

  if (!sessions[email] || isSessionExpired(sessions[email])) {
    console.log(`[Auth] Logging in as ${email}...`);
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // TODO: Update login path based on your application
    await page.goto(`${config.projects[0].use.baseURL}/auth/login`);

    const loginPage = new LoginPage(page);
    await loginPage.login(email, password);

    const storageState = await page.context().storageState();
    sessions[email] = {
      cookies: storageState.cookies,
      origins: storageState.origins,
    };

    fs.mkdirSync(path.dirname(sessionsPath), { recursive: true });
    fs.writeFileSync(sessionsPath, JSON.stringify(sessions, null, 2));
    await browser.close();
    console.log(`[Auth] Session saved for ${email}`);
  } else {
    console.log(`[Auth] Using cached session for ${email}`);
  }

  fs.writeFileSync(".auth/user.json", JSON.stringify(sessions[email], null, 2));
}

function isSessionExpired(session: { cookies: any[] }) {
  if (!session?.cookies) return true;
  const now = new Date();
  return session.cookies.some((cookie) => {
    if (!cookie.expires || cookie.expires === -1) return false;
    return new Date(cookie.expires * 1000) < now;
  });
}

export default globalSetup;
