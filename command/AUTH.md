# Authentication & Cookies Flow

## Multi-Credential Session Management

### Flow

1. **Global setup** (`tests/auth.setup.ts`) runs once before all tests:
   - Loads `.env` (USER_EMAIL, USER_PASSWORD)
   - Checks `.auth/sessions.json` for existing session
   - **TTL validation**: Parse `cookie.expires`, if expired → re-login
   - If session missing/expired: launch browser, login, save to `sessions.json`
   - Copy current credential to `.auth/user.json`

2. **Non-auth specs** (feature tests):
   - Start with `await page.goto("/")` - session loaded from global storageState
   - No repeated login

3. **Auth specs** (testing login flow):
   - Load cookies from `.auth/sessions.json` manually
   - Inject: `await context.addCookies(sessions[email].cookies)`
   - Navigate: `await page.goto("/")`

### Multi-Credential Storage

```json
// .auth/sessions.json
{
  "admin@dot.co.id": { "cookies": [...], "origins": [...] },
  "user@dot.co.id": { "cookies": [...], "origins": [...] }
}
```

### TTL Validation

```javascript
function isSessionExpired(session) {
  if (!session?.cookies) return true;
  const now = new Date();
  return session.cookies.some(cookie => {
    if (!cookie.expires) return false;
    return new Date(cookie.expires * 1000) < now;
  });
}
```

### Switching Credentials

```bash
USER_EMAIL=admin@dot.co.id npx playwright test  # Uses admin session
USER_EMAIL=user@dot.co.id npx playwright test   # Uses user session
```
