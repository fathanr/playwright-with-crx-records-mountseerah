# CRX + Playwright + AI Template

## Overview

A boilerplate template for automated smoke test generation from Chrome Extension (CRX) recordings using AI. Supports multi-credential cookie management with TTL validation.

**This is a template/boilerplate** - Clone and customize for your project.

## Features

- **AI-powered generation**: Convert Playwright recordings to Page Objects + Smoke Tests
- **Multi-credential support**: Store and reuse sessions for multiple users
- **TTL validation**: Auto re-login when cookies expire
- **Smart auth handling**: Auth specs test login, feature specs skip login
- **Selector suggestions**: AI recommends data-testid improvements

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 20+** - [Download here](https://nodejs.org/)
- **npm** - Comes with Node.js
- **Git** - For cloning the repository

Verify your installation:

```bash
node --version  # Should be v20.x.x or higher
npm --version
```

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd crx-playwright-with-ai
```

2. Install dependencies:

```bash
npm install
```

3. Install Playwright browsers:

```bash
npm run setup
```

## Environment Setup

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Configure your environment variables in `.env`:

| Variable        | Description                 | Example                         |
| --------------- | --------------------------- | ------------------------------- |
| `USER_EMAIL`    | Your login email credential | `admin@dot.co.id`               |
| `USER_PASSWORD` | Your account password       | `your_password`                 |
| `BASE_URL`      | Application base URL        | `https://pamafix-dev.dot.co.id` |

**Important Notes:**

- `BASE_URL` is used by Playwright config for all tests
- Login paths are extracted from recordings (e.g., `/auth/login`)
- Different projects need different `BASE_URL` values
- Contact your team lead for test account credentials

**For different projects:**

```bash
# Project A
BASE_URL=https://project-a.example.com

# Project B
BASE_URL=https://project-b.example.com
```

## First Run

Before running tests, you need to:

1. **Configure your application**:
   - Update `BASE_URL` in `.env` to your application URL
   - Update login path in `tests/auth.setup.ts` (default: `/auth/login`)
   - Update post-login selector in `tests/smoke/auth/login.spec.ts`

2. **Record your login flow**:
   ```bash
   npx playwright codegen $BASE_URL
   ```
   - Record your actual login flow
   - Save to `records-crx/auth/login.record.ts`
   - Generate Login.page.ts using AI (see "Generating Tests from Recordings")

3. **Run authentication setup**:
   ```bash
   npm run smoke
   ```

On your first test run, authentication will be set up automatically:

1. The `auth.setup.ts` global setup runs before any tests
2. It logs in using your `.env` credentials
3. Session data is saved to:
   - `.auth/sessions.json` - Multi-credential storage
   - `.auth/user.json` - Current user session
4. **TTL validation**: Cookies are checked for expiry before each run
5. **Auto re-login**: If cookies expired, system re-authenticates automatically

**Note:** First run will be slower (~10-15 seconds) due to authentication setup. Subsequent runs use cached sessions.

## Running Tests

Run different test scenarios:

```bash
# Run smoke tests only (recommended for CI)
npm run smoke

# Run all tests
npm test

# Run specific test file
npx playwright test tests/smoke/master-data/entity/create-data-entity.spec.ts

# Run tests in UI mode (interactive)
npx playwright test --ui

# View test report
npm run report
```

**Test execution flow:**

1. Global setup authenticates (if needed)
2. Tests run with loaded session
3. No login steps in feature tests
4. Report generated automatically

## Generating Tests from Recordings

Follow this workflow to generate tests from UI recordings:

### Step 1: Record Your Flow

Use Playwright Codegen to record your user flow:

```bash
# Use your BASE_URL from .env
npx playwright codegen $BASE_URL

# Or specify directly
npx playwright codegen https://your-project.example.com
```

📖 [Learn more about Playwright Codegen](https://playwright.dev/docs/codegen)

### Step 2: Save Recording

Save the generated code to `records-crx/` following the folder structure:

```
records-crx/
  └── <feature-path>/
      └── <action>.record.ts

Example:
records-crx/master-data/entity/create-entity.record.ts
```

### Step 3: Call AI Prompt

Open your AI assistant and provide:

1. The content of `command/AI_MASTER_PROMPT.md`
2. The recording file you just created

Example prompt:

```
read the brief in command/AI_MASTER_PROMPT.md and Generate from: records-crx/master-data/entity/create-entity.record.tsx
```

### Step 4: Review Output

AI generates three files:

- **Page Object** - `pages/<feature-path>/<Feature>.page.ts`
- **Test Spec** - `tests/smoke/<feature-path>/<action>.spec.ts`
- **Selector Suggestions** - Recommendations for data-testid improvements

**Review checklist (≤ 5 minutes):**

- ✅ Folder structure matches recording path
- ✅ No login logic in feature specs
- ✅ At least 2 assertions present
- ✅ Selectors use data-testid where possible

### Step 5: Run Generated Test

```bash
npx playwright test tests/smoke/<feature-path>/<action>.spec.ts
```

### Step 6: Refine if Needed

If tests fail due to selectors:

1. Check selector suggestions from AI output
2. Add recommended `data-testid` attributes to your UI components
3. Update Page Object selectors if needed
4. Re-run tests

**Folder structure mapping:**

```
Recording:  records-crx/master-data/entity/create-entity.record.ts
         ↓
Page Object: pages/master-data/entity/Entity.page.ts
Test Spec:   tests/smoke/master-data/entity/create-entity.spec.ts
```

## Troubleshooting

### Authentication failed

**Problem:** Tests fail with login errors

**Solution:**

- Verify credentials in `.env` file are correct
- Ensure `USER_EMAIL` and `USER_PASSWORD` match a valid test account
- Check `BASE_URL` points to the correct environment

### Session expired

**Problem:** "Session expired" or "Unauthorized" errors

**Solution:**

```bash
# Delete cached sessions and re-authenticate
rm -rf .auth/
npm run smoke
```

### Browser not found

**Problem:** "Executable doesn't exist" error

**Solution:**

```bash
# Reinstall Playwright browsers
npm run setup
```

### Tests timeout

**Problem:** Tests hang or timeout

**Solution:**

- Check `BASE_URL` in `.env` is accessible
- Verify network connection
- Check if application is running
- Increase timeout in `playwright.config.ts` if needed

### AI generation failed

**Problem:** AI doesn't generate correct output

**Solution:**

- Verify recording file format matches Playwright syntax
- Ensure `command/AI_MASTER_PROMPT.md` is provided to AI
- Check recording file path follows convention: `records-crx/<path>/<file>.record.ts`
- Review `command/AI_CONTRACT.md` for expected output format

### Critical files deleted

**Problem:** Template broken after deleting files

**Solution:**

- Check `command/CRITICAL_FILES.md` for recovery steps
- Restore from git: `git checkout -- <file>`
- If `.auth/` deleted: Will regenerate on next run
- If `node_modules/` deleted: Run `npm install`

## Roadmap Plan (Smoke CI Ready)

### Phase 1: Define Contract ✅

- Smoke only
- Happy path only
- Selector & helper rules
- Multi-credential cookie management

### Phase 2: CRX Recording

- Engineer record UI flow feature baru
- Fokus 1 flow sukses

### Phase 3: CRX Output Standard

- Intent JSON terstruktur
- `ciReady=true`

### Phase 4: AI Generation

- Generate Playwright smoke test pakai helper
- Wajib mengikuti template baku
- Auto-detect login flow
- Generate auth.setup.ts with sessions.json

### Phase 5: Auto Validation

- No hard wait
- Minimal 2 assertion
- Selector stabil
- TTL check for cookies

### Phase 6: Engineer Review

- Review cepat ≤ 5 menit
- Tidak boleh logic kompleks

### Phase 7: Commit & CI

- Commit ke repo
- CI run smoke only:
  `npx playwright test --grep @smoke`

### Phase 8: Post-CI Policy

- Flaky test keluar dari smoke suite
- Edge case dibuat manual
- CRX + AI hanya untuk test pertama feature baru

## Cookie Management

### Multi-Credential Storage

```json
// .auth/sessions.json
{
  "admin@dot.co.id": { "cookies": [...], "origins": [...] },
  "user@dot.co.id": { "cookies": [...], "origins": [...] }
}
```

### Switch Credentials

```bash
USER_EMAIL=admin@dot.co.id USER_PASSWORD=pass1 npx playwright test
USER_EMAIL=user@dot.co.id USER_PASSWORD=pass2 npx playwright test
```

### TTL Validation

- Auto-check cookie expiry before tests
- Re-login only if expired
- No repeated logins for valid sessions

## Documentation

- `README.md` - Main documentation (this file)
- `STRUCTURE.md` - Project structure overview
- `command/AI_MASTER_PROMPT.md` - AI generation instructions
- `command/AI_CONTRACT.md` - Output format contract
- `command/AI_EXAMPLE_OUTPUT.md` - Example outputs
- `command/AUTH_COOKIES_FLOW.md` - Cookie management flow
- `command/AUTH_AND_COOKIES.md` - Session reuse guide
- `command/SELECTOR_IMPROVEMENT_SUGGESTIONS.md` - Selector recommendations
- `command/MULTI_PROJECT_SUPPORT.md` - Multi-project configuration guide
- `command/CRITICAL_FILES.md` - Files and folders that must not be deleted

## Workflow

1. **Record** - Use Playwright Codegen to record flow → save to `records-crx/`
2. **Generate** - AI detects login flow → generates Page Object + Spec + auth.setup.ts just call command AI file `AI_MASTER_PROMPT.md` and call file `record`
3. **Review** - Quick review ≤ 5 minutes
4. **Run** - `npx playwright test --grep @smoke`
5. **Commit** - Push to repo, CI runs smoke tests

## Key Rules

- **No login in feature specs** - Session loaded from `.auth/user.json`
- **Auth specs inject cookies manually** - Test login flow with `context.addCookies()`
- **Folder structure matches record path** - `records-crx/foo/bar.record.ts` → `pages/foo/Bar.page.ts`
- **Minimal assertions** - At least 2 per test
- **Prefer data-testid** - Over role/text selectors
- **Dynamic URLs** - Always use `process.env.BASE_URL`, never hardcode project-specific URLs
- **Extract login paths** - From recordings, use relative paths in auth.setup.ts
- **Never delete critical files** - See `command/CRITICAL_FILES.md` for protected files/folders
