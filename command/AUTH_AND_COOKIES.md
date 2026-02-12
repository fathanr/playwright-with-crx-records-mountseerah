# How cookies / session are saved and reused (Multi-Credential)

## Flow

1. **Global setup** (`tests/auth.setup.ts`) runs **once** before all tests:

   - Loads `.env` (USER_EMAIL, USER_PASSWORD).
   - Checks `.auth/sessions.json` for existing session with matching email.
   - **TTL validation**: Parse `cookie.expires` field, if any cookie expired → re-login.
   - If session missing or expired:
     - Launches browser, opens login page, calls `LoginPage.login()`.
     - Waits for post-login UI (e.g. "bill-icon" button).
     - Saves **storage state** to `.auth/sessions.json`:
       ```json
       {
         "admin@dot.co.id": { "cookies": [...], "origins": [...] },
         "user@dot.co.id": { "cookies": [...], "origins": [...] }
       }
       ```
     - Closes browser.
   - Copies current credential session to `.auth/user.json` (for global storageState).

2. **Playwright config** (`playwright.config.ts`):

   - `globalSetup: "./tests/auth.setup.ts"` — run the login once.
   - `use.storageState: ".auth/user.json"` — every **non-auth** test gets a new context that **loads** this file (cookies + storage) before the test runs.

3. **Non-auth specs** (feature tests) do **not** call `LoginPage.login()`:
   - Start with `await page.goto("/")` so the page loads with the saved session.
   - No repeated login; faster and more stable.

4. **Auth specs** (testing login flow itself):
   - Load cookies from `.auth/sessions.json` based on `process.env.USER_EMAIL`.
   - Inject manually: `await context.addCookies(sessions[email].cookies)`.
   - Then navigate: `await page.goto("/")`.
   - Verify login success with assertions.

## Multi-Credential Support

- **sessions.json** stores multiple credentials: `{ "email1": {...}, "email2": {...} }`
- **user.json** stores current credential (copied from sessions.json)
- Switch credentials by changing `USER_EMAIL` env var
- No re-login if session exists and cookies not expired

## TTL Validation

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

## Updating saved cookies

- Re-run the full test suite: `npx playwright test` (global setup runs again and updates `.auth/sessions.json` if expired).
- Or run only the setup (custom script): run `auth.setup.ts` once to refresh cookies.
- Change `USER_EMAIL` to test with different credential.

## File location

- **Multi-credential storage:** `.auth/sessions.json` (gitignored).
- **Current session:** `.auth/user.json` (gitignored, used by global storageState).
- **Setup script:** `tests/auth.setup.ts`.
