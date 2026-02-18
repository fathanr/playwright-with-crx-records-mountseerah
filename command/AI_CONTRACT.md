# AI Output Contract

## Output Format (Strict)

```
--- pages/[<subfolder>/]<FeatureName>.page.ts ---
(code)

--- tests/smoke/[<subfolder>/]<feature-name>.spec.ts ---
(code)

--- Selector Improvement Suggestions ---
(list)
```

**Auth records** (with login flow) add:
```
--- pages/auth/Login.page.ts ---
(code)

--- tests/auth.setup.ts ---
(code)

--- tests/smoke/auth/login.spec.ts ---
(code)
```

## Rules

- Folder structure matches record path
- Feature page excludes login logic
- Smoke spec starts with `await page.goto("/")` (no login call)
- Do NOT import LoginPage in generated specs
- Minimum 2 assertions per test
- Prefer data-testid selectors
