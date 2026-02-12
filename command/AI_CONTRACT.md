# CRX AI Output Contract (V2)

AI MUST output exactly:

--- pages/[<subfolder>/]<FeatureName>.page.ts ---
(code)

--- tests/smoke/[<subfolder>/]<feature-name>.spec.ts ---
(code)

--- Selector Improvement Suggestions ---
(list)

[For auth records with login flow only:]
--- pages/auth/Login.page.ts ---
(code)
--- tests/auth.setup.ts ---
(code)

Output folder must match record path: if record is records-crx/master-description/search.record.ts, output pages/master-description/Description.page.ts and tests/smoke/master-description/description.spec.ts. Imports in spec must use correct relative path to pages/ (do not import LoginPage; auth is global).

Rules:

- Standard output: 3 sections (page, spec, suggestions). Auth records with login: add Login.page.ts and auth.setup.ts.
- No explanation
- Feature page excludes login
- Smoke spec does NOT call login: start with await page.goto("/"); (session from global setup / storageState)
- Do not import LoginPage in generated specs

## Cookie & Session Management

Auth setup rules:
- Import "dotenv/config" at top
- Use process.env.USER_EMAIL, process.env.USER_PASSWORD
- Save storageState to `.auth/sessions.json` with format: `{ "email": { "cookies": [...], "origins": [...] } }`
- Check TTL: parse cookie.expires field, if any cookie expired → re-login and re-save
- If sessions.json exists and credential matches and cookies not expired → skip login

Auth spec rules (for testing login flow itself):
- Load cookies from `.auth/sessions.json` based on process.env.USER_EMAIL
- Inject cookies manually: `await context.addCookies(sessions[email].cookies)`
- Then navigate: `await page.goto("/")`

Non-auth spec rules (feature tests):
- Use global storageState (unchanged behavior)
- Start with `await page.goto("/")`
