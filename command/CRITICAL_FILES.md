# Critical Files & Folders

## ⚠️ DO NOT DELETE

These files and folders are essential for the template to function. Deleting them will break the system.

### Core Configuration Files

```
✅ REQUIRED - Never delete:

playwright.config.ts          # Playwright configuration, reads BASE_URL from .env
package.json                  # Dependencies and npm scripts
package-lock.json             # Dependency lock file
.env                          # Environment variables (USER_EMAIL, USER_PASSWORD, BASE_URL)
.env.example                  # Template for .env file
.gitignore                    # Git ignore rules
tsconfig.json                 # TypeScript configuration (if exists)
```

### Core Directories

```
✅ REQUIRED - Never delete:

command/                      # AI generation rules and documentation
├── AI_MASTER_PROMPT.md       # Main AI generation instructions
├── AI_CONTRACT.md            # Output format contract
├── AI_EXAMPLE_OUTPUT.md      # Generation examples
├── AUTH_COOKIES_FLOW.md      # Session management flow
├── AUTH_AND_COOKIES.md       # Session reuse guide
├── SELECTOR_IMPROVEMENT_SUGGESTIONS.md
├── SELECTOR_STRATEGY.md
├── DATA_TESTID_GUIDE.md
└── MULTI_PROJECT_SUPPORT.md

tests/                        # Test directory
├── auth.setup.ts             # Global auth setup (CRITICAL)
└── smoke/                    # Smoke test specs

pages/                        # Page Object Models
└── auth/                     # Auth pages
    └── Login.page.ts         # Login page object (CRITICAL if using auth)

utils/                        # Helper utilities (optional)
├── SmartWait.ts              # Smart wait helpers
├── SelectorHelper.ts         # Selector utilities
└── WaitConfig.ts             # Wait configuration

records-crx/                  # Playwright recordings (input for AI)
fixtures/                     # Test fixtures and data
tools/                        # Generation tools
└── generate-from-record.js   # AI generation script
```

### Runtime Directories

```
⚠️ IMPORTANT - Can be regenerated but contains session data:

.auth/                        # Session storage (gitignored)
├── sessions.json             # Multi-credential storage
└── user.json                 # Current session for global storageState

❌ Safe to delete (will be regenerated):
- Deleting .auth/ will force re-login on next run
- Sessions will be recreated automatically
```

### Generated Directories

```
✅ Safe to delete (auto-generated):

node_modules/                 # Dependencies (run: npm install)
playwright-report/            # Test reports (regenerated on test run)
test-results/                 # Test results (regenerated on test run)
.playwright/                  # Playwright cache
dist/                         # Build output (if exists)
```

## 🔒 Critical Files Explained

### 1. `playwright.config.ts`
**Why critical:** Defines baseURL, storageState, and global setup
```typescript
baseURL: process.env.BASE_URL,        // Dynamic URL per project
storageState: ".auth/user.json",      // Session loading
globalSetup: "./tests/auth.setup.ts"  // Auth before tests
```

### 2. `tests/auth.setup.ts`
**Why critical:** Handles multi-credential session management
- Creates `.auth/` directory
- Manages `sessions.json` and `user.json`
- TTL validation and auto re-login
- Without this: No authentication, all tests fail

### 3. `pages/auth/Login.page.ts`
**Why critical:** Required by auth.setup.ts for login
- Used in global setup
- Without this: Auth setup fails

### 4. `command/AI_MASTER_PROMPT.md`
**Why critical:** Main instructions for AI generation
- Defines generation rules
- Login detection logic
- OTP handling
- Session management rules

### 5. `.env`
**Why critical:** Contains credentials and BASE_URL
```bash
USER_EMAIL=admin@example.com
USER_PASSWORD=password
BASE_URL=https://example.com
```
Without this: Tests cannot authenticate or navigate

### 6. `utils/` directory (Optional)
**Why optional:** Contains helper utilities for advanced use cases
- SmartWait: Intelligent waiting strategies
- SelectorHelper: Selector validation and helpers
- WaitConfig: Timeout configurations
- Can be used in generated tests if needed
- Not required for basic test generation

## 📝 Safe to Modify

```
✅ Can be modified/deleted safely:

tests/smoke/**/*.spec.ts      # Individual test specs (regenerate from recordings)
pages/**/*.page.ts            # Page objects (except Login.page.ts)
records-crx/**/*.record.ts    # Recordings (can re-record)
README.md                     # Documentation
folder-structure.md           # Documentation
```

## 🗑️ Safe to Delete

```
✅ Can delete without breaking system:

Individual test specs          # Regenerate from recordings
Individual page objects        # Regenerate from recordings
Individual recordings          # Re-record with codegen
.auth/                        # Will regenerate on next run
playwright-report/            # Regenerated on test run
test-results/                 # Regenerated on test run
node_modules/                 # Run: npm install
```

## ⚠️ Deletion Consequences

| Delete | Consequence | Recovery |
|--------|-------------|----------|
| `playwright.config.ts` | Tests won't run | Restore from git or recreate |
| `tests/auth.setup.ts` | No authentication | Restore from git or regenerate with AI |
| `pages/auth/Login.page.ts` | Auth setup fails | Restore from git or regenerate with AI |
| `command/` directory | AI generation broken | Restore from git |
| `.env` | Tests can't authenticate | Copy from `.env.example` and configure |
| `utils/` directory | Helper functions missing | Restore from git |
| `.auth/` directory | Force re-login | Auto-regenerated on next run |
| `tests/smoke/` directory | No tests to run | Regenerate from recordings |
| `node_modules/` | Dependencies missing | Run `npm install` |

## 🔄 Recovery Commands

```bash
# Restore deleted .auth/ (force re-login)
rm -rf .auth/
npm run smoke  # Will recreate sessions

# Restore node_modules
rm -rf node_modules/
npm install

# Restore .env
cp .env.example .env
# Then edit .env with your credentials

# Restore from git (if committed)
git checkout -- <file-or-folder>

# Regenerate tests from recordings
# Use AI with command/AI_MASTER_PROMPT.md
```

## 📋 Checklist Before Deletion

Before deleting any file/folder, ask:

- [ ] Is it in the "REQUIRED" list above?
- [ ] Is it referenced in `playwright.config.ts`?
- [ ] Is it imported by `tests/auth.setup.ts`?
- [ ] Is it in the `command/` directory?
- [ ] Is it a utility in `utils/` directory?
- [ ] Do I have a backup or can restore from git?

If any answer is YES → **DO NOT DELETE** without understanding impact.

## 🆘 Emergency Recovery

If you accidentally deleted critical files:

```bash
# 1. Restore from git
git status
git checkout -- <deleted-file>

# 2. If not in git, restore from template
# Clone fresh template to separate folder
# Copy missing files back

# 3. Regenerate auth files with AI
# Provide command/AI_MASTER_PROMPT.md to AI
# Generate from auth recording
```

## 📌 Summary

**Never delete:**
- `playwright.config.ts`
- `tests/auth.setup.ts`
- `pages/auth/Login.page.ts`
- `command/` directory
- `utils/` directory
- `.env`

**Safe to delete:**
- `.auth/` (will regenerate)
- `node_modules/` (run npm install)
- Individual test specs (regenerate from recordings)
- Test reports and results
