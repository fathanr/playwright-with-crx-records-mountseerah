# CRX + Playwright + AI Template

## Overview

Automated smoke test generation from Chrome Extension (CRX) recordings using AI. Supports multi-credential cookie management with TTL validation.

## Features

- **AI-powered generation**: Convert Playwright recordings to Page Objects + Smoke Tests
- **Multi-credential support**: Store and reuse sessions for multiple users
- **TTL validation**: Auto re-login when cookies expire
- **Smart auth handling**: Auth specs test login, feature specs skip login
- **Selector suggestions**: AI recommends data-testid improvements

## Quick Start

```bash
npm install
npm run smoke
```

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

- `docs/AI_MASTER_PROMPT.md` - AI generation instructions
- `docs/AI_CONTRACT.md` - Output format contract
- `docs/AI_EXAMPLE_OUTPUT.md` - Example outputs
- `docs/AUTH_COOKIES_FLOW.md` - Cookie management flow
- `docs/AUTH_AND_COOKIES.md` - Session reuse guide
- `docs/SELECTOR_IMPROVEMENT_SUGGESTIONS.md` - Selector recommendations

## Workflow

1. **Record** - Use Playwright Codegen to record flow → save to `records-crx/`
2. **Generate** - AI detects login flow → generates Page Object + Spec + auth.setup.ts
3. **Review** - Quick review ≤ 5 minutes
4. **Run** - `npx playwright test --grep @smoke`
5. **Commit** - Push to repo, CI runs smoke tests

## Key Rules

- **No login in feature specs** - Session loaded from `.auth/user.json`
- **Auth specs inject cookies manually** - Test login flow with `context.addCookies()`
- **Folder structure matches record path** - `records-crx/foo/bar.record.ts` → `pages/foo/Bar.page.ts`
- **Minimal assertions** - At least 2 per test
- **Prefer data-testid** - Over role/text selectors

