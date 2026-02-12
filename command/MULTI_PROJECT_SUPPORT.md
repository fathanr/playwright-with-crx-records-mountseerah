# Multi-Project Support

This template supports multiple projects through dynamic configuration.

## How It Works

### 1. Dynamic Base URL

**playwright.config.ts** reads from environment:
```typescript
use: {
  baseURL: process.env.BASE_URL,
  // ...
}
```

### 2. Login Path Extraction

AI extracts login path from recordings:
```typescript
// Recording has:
await page.goto("https://project-a.com/auth/login");

// AI extracts path: /auth/login
// Generated auth.setup.ts uses:
await page.goto(config.projects[0].use.baseURL + "/auth/login");
```

### 3. Per-Project Configuration

Each project needs its own `.env`:

```bash
# Project A
USER_EMAIL=admin@project-a.com
USER_PASSWORD=password_a
BASE_URL=https://project-a.example.com

# Project B
USER_EMAIL=admin@project-b.com
USER_PASSWORD=password_b
BASE_URL=https://project-b.example.com
```

## Switching Between Projects

### Option 1: Multiple .env files

```bash
# Create per-project env files
.env.project-a
.env.project-b

# Copy when switching
cp .env.project-a .env
npm run smoke
```

### Option 2: Environment variables

```bash
# Override at runtime
BASE_URL=https://project-a.com USER_EMAIL=admin@a.com npx playwright test
BASE_URL=https://project-b.com USER_EMAIL=admin@b.com npx playwright test
```

### Option 3: Separate directories

```bash
# Clone template per project
crx-playwright-project-a/
crx-playwright-project-b/

# Each has its own .env and recordings
```

## Session Management

Sessions are stored per email in `.auth/sessions.json`:

```json
{
  "admin@project-a.com": {
    "cookies": [...],
    "origins": [...]
  },
  "admin@project-b.com": {
    "cookies": [...],
    "origins": [...]
  }
}
```

Switching projects automatically uses the correct session based on `USER_EMAIL`.

## Recording for Different Projects

```bash
# Project A
BASE_URL=https://project-a.com npx playwright codegen $BASE_URL

# Project B
BASE_URL=https://project-b.com npx playwright codegen $BASE_URL
```

## AI Generation Rules

AI automatically:
1. Extracts login URL from recording
2. Uses relative path in auth.setup.ts
3. Never hardcodes project-specific URLs
4. Uses `config.projects[0].use.baseURL` for dynamic URLs

## Best Practices

✅ **DO:**
- Use `process.env.BASE_URL` in all configs
- Extract paths from recordings
- Store sessions per email
- Document project-specific setup in README

❌ **DON'T:**
- Hardcode URLs in code
- Hardcode login paths
- Mix sessions from different projects
- Commit `.env` files

## Example Workflow

```bash
# Setup Project A
echo "BASE_URL=https://project-a.com" > .env
echo "USER_EMAIL=admin@a.com" >> .env
echo "USER_PASSWORD=pass_a" >> .env

# Record and generate tests
npx playwright codegen $BASE_URL
# Save to records-crx/feature.record.ts
# AI generates with extracted paths

# Run tests
npm run smoke

# Switch to Project B
echo "BASE_URL=https://project-b.com" > .env
echo "USER_EMAIL=admin@b.com" >> .env
echo "USER_PASSWORD=pass_b" >> .env

# Sessions automatically managed per email
npm run smoke
```
