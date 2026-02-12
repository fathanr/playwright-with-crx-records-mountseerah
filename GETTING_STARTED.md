# Getting Started

Complete guide for first-time setup after cloning this template.

## 📋 Checklist

- [ ] Prerequisites installed (Node.js 20+, npm, Git)
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] Playwright browsers installed
- [ ] `.env` file configured
- [ ] Login flow recorded (optional)
- [ ] Tests running successfully

## 🚀 Step-by-Step Setup

### Step 1: Verify Prerequisites

```bash
node --version  # Should be v20.x.x or higher
npm --version   # Should be 9.x.x or higher
git --version   # Any recent version
```

If any command fails, install the missing tool:
- Node.js: https://nodejs.org/
- Git: https://git-scm.com/

### Step 2: Clone Repository

```bash
git clone <repository-url>
cd crx-playwright
```

### Step 3: Install Dependencies

```bash
npm install
```

This installs:
- Playwright test framework
- TypeScript
- dotenv for environment variables
- Other dependencies from `package.json`

**Expected output:**
```
added 123 packages in 15s
```

### Step 4: Install Playwright Browsers

```bash
npm run setup
```

Or directly:
```bash
npx playwright install
```

This downloads Chromium, Firefox, and WebKit browsers.

**Expected output:**
```
Downloading browsers...
✔ chromium downloaded
✔ firefox downloaded
✔ webkit downloaded
```

**Note:** This is a one-time setup (~200MB download).

### Step 5: Configure Environment

```bash
# Copy example file
cp .env.example .env

# Edit with your editor
nano .env
# or
code .env
# or
vim .env
```

**Update these values:**

```bash
USER_EMAIL=your_email@example.com      # Your test account email
USER_PASSWORD=your_password_here       # Your test account password
BASE_URL=https://your-app.example.com  # Your application URL
```

**Important:**
- Use a **test account**, not production credentials
- `BASE_URL` should be your application's base URL (no trailing slash)
- Never commit `.env` file (it's gitignored)

### Step 6: Update Login Configuration

Edit `tests/auth.setup.ts` and update the login path:

```typescript
// Line ~24
await page.goto(`${config.projects[0].use.baseURL}/auth/login`);
//                                                    ^^^^^^^^^^
//                                                    Update this path
```

Change `/auth/login` to match your application's login URL.

### Step 7: Update Post-Login Selector

Edit `tests/smoke/auth/login.spec.ts` and update the selector:

```typescript
// Line ~21
await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
//                         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//                         Update to match your app
```

Change to a selector that appears after successful login (e.g., user menu, dashboard button, logout button).

### Step 8: Record Your Login Flow (Optional)

If you want to regenerate the login page object:

```bash
npx playwright codegen $BASE_URL
```

1. Browser opens
2. Navigate to login page
3. Fill email and password
4. Click login
5. Wait for successful login
6. Stop recording
7. Save to `records-crx/auth/login.record.ts`

Then use AI to regenerate `Login.page.ts` (see README.md).

### Step 9: Run Tests

```bash
npm run smoke
```

**First run:**
- Global setup runs
- Browser opens (or headless if no OTP)
- Logs in with your credentials
- Saves session to `.auth/sessions.json`
- Runs tests
- Generates report

**Expected output:**
```
[Auth] Logging in as your_email@example.com...
[Auth] Session saved for your_email@example.com

Running 1 test using 1 worker
  ✓ tests/smoke/auth/login.spec.ts:4:3 › Login @smoke › should verify login session is valid (2s)

1 passed (3s)
```

**Subsequent runs:**
```
[Auth] Using cached session for your_email@example.com

Running 1 test using 1 worker
  ✓ tests/smoke/auth/login.spec.ts:4:3 › Login @smoke › should verify login session is valid (1s)

1 passed (2s)
```

### Step 10: View Test Report

```bash
npm run report
```

Opens HTML report in your browser showing test results.

## 🎯 What's Next?

Now that setup is complete, you can:

1. **Record new flows:**
   ```bash
   npx playwright codegen $BASE_URL
   ```

2. **Generate tests with AI:**
   - Provide `command/AI_MASTER_PROMPT.md` to AI
   - Provide your recording file
   - AI generates Page Object + Test Spec

3. **Run your tests:**
   ```bash
   npm run smoke
   ```

4. **Delete example files** (optional):
   ```bash
   rm records-crx/auth/login.record.ts
   # Regenerate from your own recording
   ```

## 🐛 Troubleshooting

### "Command not found: npm"
**Solution:** Install Node.js from https://nodejs.org/

### "Cannot find module '@playwright/test'"
**Solution:** Run `npm install`

### "Executable doesn't exist"
**Solution:** Run `npm run setup` or `npx playwright install`

### "Authentication failed"
**Solution:** 
- Check credentials in `.env`
- Verify `BASE_URL` is correct
- Update login path in `auth.setup.ts`

### "Session expired" errors
**Solution:**
```bash
rm -rf .auth/
npm run smoke  # Will re-login
```

### Tests fail with selector errors
**Solution:**
- Update post-login selector in `tests/smoke/auth/login.spec.ts`
- Use `data-testid` attributes in your app
- Check `command/SELECTOR_STRATEGY.md` for guidance

## 📚 Additional Resources

- `README.md` - Main documentation
- `STRUCTURE.md` - Project structure
- `command/AI_MASTER_PROMPT.md` - AI generation guide
- `command/MULTI_PROJECT_SUPPORT.md` - Multi-project setup
- `command/CRITICAL_FILES.md` - Protected files

## 💡 Tips

- **First run is slower** (~10-15s) due to authentication setup
- **Subsequent runs are fast** (~2-3s) using cached sessions
- **Session expires?** System auto re-logins
- **With OTP?** You'll need to input OTP manually on first run only
- **Multiple projects?** See `command/MULTI_PROJECT_SUPPORT.md`

## ✅ Success Criteria

You're ready when:
- ✅ `npm run smoke` passes
- ✅ `.auth/sessions.json` exists
- ✅ Test report shows green checkmarks
- ✅ You can record and generate new tests

Happy testing! 🚀
