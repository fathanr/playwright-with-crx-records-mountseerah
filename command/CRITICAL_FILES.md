# Critical Files & Folders

## ⚠️ NEVER DELETE

| File/Folder | Why |
|-------------|-----|
| `playwright.config.ts` | Config, baseURL, globalSetup |
| `tests/auth.setup.ts` | Auth + session management |
| `pages/auth/Login.page.ts` | Used by auth.setup.ts |
| `command/` | AI generation rules |
| `.env` | Credentials + BASE_URL |

## ⚠️ IMPORTANT

| File/Folder | Why |
|-------------|-----|
| `.auth/` | Session storage (gitignored) |
| `utils/` | Helper utilities |

## ✅ SAFE TO DELETE

- `tests/smoke/**/*.spec.ts` - Regenerate from recordings
- `pages/**/*.page.ts` - Regenerate from recordings
- `node_modules/` - Run `npm install`
- `playwright-report/` - Regenerated on test run
