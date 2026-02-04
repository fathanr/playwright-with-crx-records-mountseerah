# Auth & Cookies Flow (Multi-Credential Support)

## Overview

This system supports multiple credentials with separate cookie storage and TTL validation. Auth specs test login flow with manual cookie injection, while feature specs use global storageState.

## Flow Diagram

```
Record File → AI Detect Login → Extract Credential → Generate auth.setup.ts
                                                    ↓
                                            Check .auth/sessions.json
                                                    ↓
                                    ┌───────────────┴───────────────┐
                                    ↓                               ↓
                        Session exists & valid              Session missing/expired
                                    ↓                               ↓
                            Skip login                      Perform login
                                    ↓                               ↓
                                    └───────────────┬───────────────┘
                                                    ↓
                                        Save to sessions.json
                                        { "email": { cookies, origins } }
                                                    ↓
                                        Copy to .auth/user.json (global)
```

## File Structure

```
.auth/
├── sessions.json          # Multi-credential storage
│   {
│     "admin@dot.co.id": { "cookies": [...], "origins": [...] },
│     "user@dot.co.id": { "cookies": [...], "origins": [...] }
│   }
└── user.json             # Current session (for global storageState)
```

## Detection Logic

AI detects login flow if record contains:
1. Password field: `getByRole("textbox", { name: /password/i })`
2. Fill action: `.fill("password123")`
3. Submit button: `getByRole("button", { name: /login/i })`

If detected → generate `Login.page.ts` + `auth.setup.ts`

## Credential Extraction

Extract from record file:
```javascript
// From this line in record:
await page.getByRole("textbox", { name: "Email" }).fill("admin@dot.co.id");

// Extract: "admin@dot.co.id"
```

Use as key in `sessions.json`.

## TTL Validation

Check cookie expiry:
```javascript
function isSessionExpired(session) {
  if (!session?.cookies) return true;
  const now = new Date();
  return session.cookies.some(cookie => {
    if (!cookie.expires) return false; // session cookie, always valid
    return new Date(cookie.expires * 1000) < now; // expires is Unix timestamp
  });
}
```

## Auth Setup Implementation

```typescript
// tests/auth.setup.ts
import "dotenv/config";
import { chromium, type FullConfig } from "@playwright/test";
import { LoginPage } from "../pages/auth/Login.page";
import fs from "fs";
import path from "path";

async function globalSetup(config: FullConfig) {
  const sessionsPath = ".auth/sessions.json";
  const email = process.env.USER_EMAIL!;
  const password = process.env.USER_PASSWORD!;

  // Load existing sessions
  let sessions: Record<string, { cookies: any[]; origins: any[] }> = {};
  if (fs.existsSync(sessionsPath)) {
    sessions = JSON.parse(fs.readFileSync(sessionsPath, "utf-8"));
  }

  // Check if login needed
  const needsLogin = !sessions[email] || isSessionExpired(sessions[email]);

  if (needsLogin) {
    console.log(`[Auth] Logging in as ${email}...`);
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(config.projects[0].use.baseURL + "/auth/old-login");
    const loginPage = new LoginPage(page);
    await loginPage.login(email, password);

    // Wait for post-login indicator
    await page.getByRole("button", { name: "bill-icon" }).waitFor();

    // Save session
    const storageState = await context.storageState();
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

  // Copy current credential to user.json for global storageState
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
```

## Auth Spec (Manual Cookie Injection)

For testing login flow itself:

```typescript
// tests/smoke/auth/login.spec.ts
import { test, expect } from "@playwright/test";
import fs from "fs";

test("Smoke - Login and verify session", async ({ browser }) => {
  const sessions = JSON.parse(fs.readFileSync(".auth/sessions.json", "utf-8"));
  const email = process.env.USER_EMAIL!;
  const session = sessions[email];

  // Create new context and inject cookies
  const context = await browser.newContext();
  await context.addCookies(session.cookies);
  const page = await context.newPage();

  await page.goto("/");

  // Verify logged in
  await expect(page.getByRole("button", { name: "bill-icon" })).toBeVisible();
  
  await context.close();
});
```

## Non-Auth Spec (Global StorageState)

For feature tests:

```typescript
// tests/smoke/master-description/description.spec.ts
import { test, expect } from "@playwright/test";
import { DescriptionPage } from "../../../pages/master-description/Description.page";

test("Smoke - Open Description and search", async ({ page }) => {
  // page already has cookies from global storageState (.auth/user.json)
  await page.goto("/");
  
  const description = new DescriptionPage(page);
  await description.openModule();
  await description.search("301");

  await expect(page).toHaveURL(/description/);
});
```

## Multi-Credential Workflow

1. **First run with admin@dot.co.id:**
   ```bash
   USER_EMAIL=admin@dot.co.id USER_PASSWORD=pass1 npx playwright test
   ```
   - Creates `.auth/sessions.json` with admin session
   - Copies to `.auth/user.json`

2. **Second run with user@dot.co.id:**
   ```bash
   USER_EMAIL=user@dot.co.id USER_PASSWORD=pass2 npx playwright test
   ```
   - Adds user session to `.auth/sessions.json` (keeps admin)
   - Copies user session to `.auth/user.json`

3. **Switch back to admin:**
   ```bash
   USER_EMAIL=admin@dot.co.id USER_PASSWORD=pass1 npx playwright test
   ```
   - Loads admin session from `.auth/sessions.json` (no re-login if valid)
   - Copies to `.auth/user.json`

## Benefits

- **No repeated logins** - Cached sessions reused until expired
- **Multi-credential support** - Test with different users without overwriting
- **TTL validation** - Auto re-login when cookies expire
- **Separation of concerns** - Auth specs test login, feature specs test features
- **Fast execution** - Feature tests skip login entirely
