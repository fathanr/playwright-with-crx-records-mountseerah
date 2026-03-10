# Building an AI-Powered Test Automation Framework with Playwright

## Introduction

In modern software development, test automation is crucial for maintaining quality while moving fast. However, writing and maintaining end-to-end tests can be time-consuming and repetitive. What if we could leverage AI to generate test code from simple UI recordings?

In this article, I'll share how I built an AI-powered test automation framework that converts Chrome Extension (CRX) recordings into production-ready Playwright tests, complete with Page Object Models, smart session management, and CI-ready smoke tests.

## The Problem

Traditional test automation workflows face several challenges:

1. **Time-consuming test creation** - Writing Page Objects and test specs manually takes 30-60 minutes per feature
2. **Repetitive authentication** - Tests waste time logging in repeatedly
3. **Brittle selectors** - Tests break when UI changes
4. **Inconsistent patterns** - Different engineers write tests differently
5. **Slow feedback loops** - Manual test writing delays CI integration

## The Solution: CRX + Playwright + AI

I designed a framework that combines three powerful technologies:

- **Chrome Extension Recordings (CRX)** - Capture user flows visually using Playwright Codegen
- **Playwright** - Robust, modern test automation framework
- **AI (LLM)** - Generate structured test code following best practices

### Architecture Overview

```
┌─────────────────┐
│  UI Recording   │  Engineer records flow with Playwright Codegen
│   (CRX Input)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   AI Generator  │  LLM converts recording to structured code
│  (GPT-4/Claude) │
└────────┬────────┘
         │
         ├──────────────┬──────────────┬─────────────────┐
         ▼              ▼              ▼                 ▼
┌──────────────┐ ┌─────────────┐ ┌──────────────┐ ┌──────────────┐
│ Page Object  │ │  Test Spec  │ │ Auth Setup   │ │  Selector    │
│   Model      │ │   (@smoke)  │ │ (if login)   │ │ Suggestions  │
└──────────────┘ └─────────────┘ └──────────────┘ └──────────────┘
```

## Key Features

### 1. AI-Powered Code Generation

The framework uses a structured prompt system to ensure consistent, high-quality output:

**Input:** Playwright Codegen recording

```typescript
// records-crx/master-data/entity/create-entity.record.ts
await page.goto("https://app.example.com/master-data/entity");
await page.getByRole("button", { name: "Add New" }).click();
await page.getByLabel("Entity Name").fill("Test Entity");
await page.getByRole("button", { name: "Save" }).click();
```

**Output:** Three generated files

**Page Object Model:**

```typescript
// pages/master-data/entity/Entity.page.ts
import { Page, Locator } from "@playwright/test";

export class EntityPage {
  readonly page: Page;
  readonly addButton: Locator;
  readonly nameInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addButton = page.getByRole("button", { name: "Add New" });
    this.nameInput = page.getByLabel("Entity Name");
    this.saveButton = page.getByRole("button", { name: "Save" });
  }

  async createEntity(name: string) {
    await this.addButton.click();
    await this.nameInput.fill(name);
    await this.saveButton.click();
  }
}
```

**Test Spec:**

```typescript
// tests/smoke/master-data/entity/create-entity.spec.ts
import { test, expect } from "@playwright/test";
import { EntityPage } from "../../../../pages/master-data/entity/Entity.page";

test.describe("Entity @smoke", () => {
  test("should create new entity", async ({ page }) => {
    await page.goto("/master-data/entity");

    const entityPage = new EntityPage(page);
    await entityPage.createEntity("Test Entity");

    // Assertions using stable selectors
    await expect(entityPage.nameInput).toHaveValue("Test Entity");
    await expect(page.getByText("Test Entity")).toBeVisible();
  });
});
```

**Selector Suggestions:**

```markdown
## Recommended data-testid Attributes

Add these to your UI components for more stable selectors:

- Button "Add New" → data-testid="entity-add-button"
- Input "Entity Name" → data-testid="entity-name-input"
- Button "Save" → data-testid="entity-save-button"
```

### 2. Smart Session Management

One of the biggest time-wasters in E2E testing is repeated authentication. I implemented a multi-credential cookie management system with TTL validation:

**Features:**

- **Multi-credential storage** - Store sessions for multiple users (admin, regular user, etc.)
- **TTL validation** - Auto-check cookie expiry before tests
- **Auto re-login** - Re-authenticate only when needed
- **Session reuse** - Tests skip login and load saved sessions

**Implementation:**

```typescript
// tests/auth.setup.ts
import { test as setup } from "@playwright/test";
import fs from "fs";

const authFile = ".auth/user.json";
const sessionsFile = ".auth/sessions.json";

setup("authenticate", async ({ page }) => {
  const email = process.env.USER_EMAIL!;
  const password = process.env.USER_PASSWORD!;

  // Check if session exists and is valid
  const sessions = loadSessions();
  if (sessions[email] && !isSessionExpired(sessions[email])) {
    console.log(`[Auth] Using cached session for ${email}`);
    await page.context().addCookies(sessions[email].cookies);
    await page.context().storageState({ path: authFile });
    return;
  }

  // Perform login
  console.log(`[Auth] Logging in as ${email}...`);
  await page.goto("/auth/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();

  // Wait for successful login
  await page.waitForURL("/dashboard");

  // Save session
  const storageState = await page.context().storageState();
  sessions[email] = storageState;
  fs.writeFileSync(sessionsFile, JSON.stringify(sessions, null, 2));
  fs.writeFileSync(authFile, JSON.stringify(storageState, null, 2));

  console.log(`[Auth] Session saved for ${email}`);
});
```

**Results:**

- First run: ~10-15 seconds (includes login)
- Subsequent runs: ~2-3 seconds (session reused)
- **85% faster test execution**

### 3. Login Flow Auto-Detection

The AI automatically detects login flows and generates appropriate authentication setup:

**Detection Logic:**

```typescript
// AI checks for these patterns in recordings:
- Password field: getByRole("textbox", { name: /password/i })
- Password fill action: .fill()
- Login button: getByRole("button", { name: /login/i })

// If detected → generates:
- pages/auth/Login.page.ts
- tests/auth.setup.ts with session management
```

**OTP Support:**

For applications with OTP authentication, the framework handles it gracefully:

```typescript
// AI detects OTP fields and generates:
setup("authenticate", async ({ browser }) => {
  const context = await browser.newContext({ headless: false }); // Visual mode
  const page = await context.newPage();

  await page.goto("/auth/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();

  // Wait for manual OTP entry
  console.log("[Auth] Please enter OTP manually...");
  await page.waitForURL("/dashboard", { timeout: 120000 }); // 2 min timeout

  // Save session after OTP
  await page.context().storageState({ path: authFile });
});
```

### 4. Selector Strategy & Stability

The framework enforces a selector hierarchy for maximum stability:

**Priority Order:**

1. `data-testid` attributes (most stable)
2. `role` + accessible name
3. `label` associations
4. `placeholder` text
5. Visible text (least stable)

**AI automatically suggests improvements:**

```markdown
## Current Selectors (Generated)

- page.getByRole('button', { name: 'Submit' })
- page.getByPlaceholder('Enter name')

## Recommended Improvements

Add these data-testid attributes to your components:

<!-- Before -->

<button>Submit</button>

<!-- After -->

<button data-testid="submit-button">Submit</button>

<!-- Usage in tests -->

page.getByTestId('submit-button')
```

### 5. CI-Ready Smoke Tests

All generated tests are tagged with `@smoke` for easy CI integration:

```typescript
test.describe("Feature @smoke", () => {
  test("should perform action", async ({ page }) => {
    // Test code
  });
});
```

**CI Configuration:**

```yaml
# .github/workflows/smoke-tests.yml
name: Smoke Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npm run smoke
        env:
          USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
          USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
          BASE_URL: ${{ secrets.BASE_URL }}
```

## Workflow in Action

### Step 1: Record User Flow (2 minutes)

```bash
npx playwright codegen https://your-app.com
```

Engineer performs the flow visually, Playwright generates code automatically.

### Step 2: Save Recording (30 seconds)

```bash
# Save to records-crx/ following folder structure
records-crx/master-data/entity/create-entity.record.ts
```

### Step 3: Generate with AI (1 minute)

```bash
# Provide to AI:
1. command/AI_MASTER_PROMPT.md (generation rules)
2. records-crx/master-data/entity/create-entity.record.ts (recording)

# AI generates:
- pages/master-data/entity/Entity.page.ts
- tests/smoke/master-data/entity/create-entity.spec.ts
- Selector improvement suggestions
```

### Step 4: Review & Run (2 minutes)

```bash
# Quick review checklist:
✅ Folder structure matches
✅ No login logic in feature specs
✅ At least 2 assertions present
✅ Selectors use data-testid where possible

# Run test
npx playwright test tests/smoke/master-data/entity/create-entity.spec.ts
```

### Step 5: Commit to CI (30 seconds)

```bash
git add .
git commit -m "feat: add entity creation smoke test"
git push

# CI automatically runs: npm run smoke
```

**Total time: ~6 minutes** (vs 30-60 minutes manual)

## Results & Impact

### Time Savings

| Task                  | Manual        | AI-Generated | Savings  |
| --------------------- | ------------- | ------------ | -------- |
| Page Object creation  | 15-20 min     | 1 min        | 90%      |
| Test spec writing     | 15-20 min     | 1 min        | 90%      |
| Selector optimization | 10-15 min     | 1 min        | 85%      |
| Auth setup            | 20-30 min     | Auto         | 100%     |
| **Total per feature** | **60-85 min** | **6 min**    | **~90%** |

### Quality Improvements

- **Consistent patterns** - All tests follow the same structure
- **Better selectors** - AI suggests data-testid improvements
- **Fewer flaky tests** - Smart waits and stable selectors
- **Faster execution** - Session reuse eliminates repeated logins
- **Easier maintenance** - Page Object pattern centralizes selectors

### Team Adoption

- **Lower barrier to entry** - Junior engineers can generate tests
- **Faster onboarding** - New team members productive in hours
- **Better coverage** - More tests written = better quality
- **CI integration** - Smoke tests run on every PR

## Technical Challenges & Solutions

### Challenge 1: Dynamic Selectors

**Problem:** UI elements with dynamic IDs or classes break tests

**Solution:**

- AI prioritizes stable selectors (role, label, data-testid)
- Generates selector improvement suggestions
- Encourages data-testid adoption

### Challenge 2: Session Expiry

**Problem:** Cookies expire, causing random test failures

**Solution:**

- TTL validation before each test run
- Auto re-login when expired
- Multi-credential storage for different user types

### Challenge 3: OTP Authentication

**Problem:** Automated tests can't handle OTP

**Solution:**

- Detect OTP in recordings
- Launch browser in visual mode (headless: false)
- Wait for manual OTP entry (one-time setup)
- Save session after OTP for reuse

### Challenge 4: Inconsistent Output

**Problem:** AI generates different code each time

**Solution:**

- Structured prompt with strict rules (AI_CONTRACT.md)
- Example outputs for reference (AI_EXAMPLE_OUTPUT.md)
- Validation rules enforced in prompts

### Challenge 5: Multi-Project Support

**Problem:** Different projects need different configurations

**Solution:**

- Environment-based configuration (.env)
- Dynamic BASE_URL from environment
- Relative paths extracted from recordings
- Project-agnostic template structure

## Best Practices & Lessons Learned

### 1. Keep It Simple

**Do:**

- Focus on happy path smoke tests
- One flow per test
- Minimal assertions (2-3 per test)

**Don't:**

- Generate complex edge case tests
- Mix multiple flows in one test
- Over-assert on every element

### 2. Prototype Quality Matters

The quality of generated tests depends on recording quality:

- **Complete flows** - Record from start to finish
- **Stable UI** - Don't record on unstable environments
- **Consistent wording** - Use final UI text, not placeholders

### 3. Review is Essential

AI-generated code needs human review (~5 minutes):

- Verify assertions are meaningful
- Check selectors are stable
- Ensure no hardcoded values
- Validate folder structure

### 4. Flaky Tests Exit Smoke Suite

**Policy:**

- Flaky tests are removed from @smoke tag
- Edge cases written manually
- AI-generated tests are for first-pass coverage only

### 5. Session Management is Critical

- Always validate TTL before tests
- Support multiple credentials
- Never hardcode credentials in tests
- Use environment variables

## Future Enhancements

### Planned Features

1. **Visual regression testing** - Screenshot comparison
2. **API mocking integration** - Stub external dependencies
3. **Parallel execution** - Run tests across multiple browsers
4. **Test data management** - Generate test data automatically
5. **Self-healing selectors** - Auto-fix broken selectors using AI

### Experimental Ideas

- **Natural language test generation** - "Test user can create entity" → full test
- **Bug report to test** - Convert bug reports to regression tests
- **Test coverage analysis** - Identify untested flows
- **Auto-update tests** - Regenerate when UI changes

## Conclusion

Building an AI-powered test automation framework has transformed how our team approaches E2E testing. By combining Chrome Extension recordings, Playwright's robust automation, and AI's code generation capabilities, we've achieved:

- **90% reduction in test creation time**
- **85% faster test execution** (session reuse)
- **Consistent, maintainable test code**
- **Lower barrier to entry** for test automation
- **Faster CI feedback loops**

The key insight: **AI excels at generating structured, repetitive code following strict patterns**. By providing clear rules and examples, we can leverage AI to handle the tedious parts of test automation while engineers focus on strategy, edge cases, and quality.

## Getting Started

The framework is available as an open-source template:

```bash
# Clone the template
git clone <repository-url>
cd crx-playwright

# Install dependencies
npm install
npm run setup

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Record your first flow
npx playwright codegen $BASE_URL

# Generate tests with AI
# (Provide AI_MASTER_PROMPT.md + your recording)

# Run tests
npm run smoke
```

Full documentation: [README.md](./README.md)

---

**About the Author**

I'm a QA Engineer passionate about automation, AI, and developer productivity. This framework was built to solve real problems in test automation workflows. Connect with me on [LinkedIn](https://www.linkedin.com/in/muhammad-fathan-ridlo-a64004154) or check out my [portfolio](https://fathanr.github.io/fathan-porto.github.io/).

**Tech Stack:** TypeScript, Playwright, Node.js, AI (GPT-4/Claude), GitHub Actions

**Keywords:** Test Automation, Playwright, AI, E2E Testing, Page Object Model, CI/CD, Chrome Extension, Test Generation, QA Engineering

---

_Last updated: February 13, 2026_
