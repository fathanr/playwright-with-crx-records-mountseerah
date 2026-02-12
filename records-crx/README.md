# Example Test Structure

This directory contains example recordings from Playwright Codegen.

## How to Use

1. **Record your flow** using Playwright Codegen:
   ```bash
   npx playwright codegen $BASE_URL
   ```

2. **Save recording** to this directory following the structure:
   ```
   records-crx/
   ├── auth/
   │   └── login.record.ts          # Example: Login flow
   └── <feature-name>/
       └── <action>.record.ts       # Your feature recordings
   ```

3. **Generate tests** using AI:
   - Provide `command/AI_MASTER_PROMPT.md` to your AI assistant
   - Provide your recording file
   - AI will generate Page Object + Test Spec

## Example Structure

```
records-crx/
├── auth/
│   └── login.record.ts              # Auth flow example
├── user-management/
│   ├── create-user.record.ts
│   └── edit-user.record.ts
└── dashboard/
    └── view-dashboard.record.ts
```

## Recording Tips

- **Start from login page** if recording auth flow
- **Start from home page** for feature flows (session will be loaded)
- **Use clear actions** - Click, fill, select
- **Wait for elements** to be visible before interacting
- **Avoid manual waits** - Let Playwright auto-wait

## Next Steps

After recording:
1. Save file to `records-crx/<feature>/<action>.record.ts`
2. Run AI generation (see README.md)
3. Review generated files
4. Run tests: `npx playwright test`

## Clean Up

You can delete example recordings after creating your own:
```bash
rm -rf records-crx/auth/login.record.ts
```
