# Selector Strategy Guidelines

## Priority Order (Best to Worst)

### 1. **data-testid** (Highest Priority)
```typescript
// ✅ BEST - Stable, semantic
page.getByTestId('submit-button')
page.getByTestId('user-email-input')
```

### 2. **Role + Name** (Good)
```typescript
// ✅ GOOD - Accessible, semantic
page.getByRole('button', { name: 'Submit' })
page.getByRole('textbox', { name: 'Email' })
```

### 3. **Label/Placeholder** (OK)
```typescript
// ⚠️ OK - Can change with copy updates
page.getByLabel('Email Address')
page.getByPlaceholder('Enter your email')
```

### 4. **Text Content** (Fragile)
```typescript
// ⚠️ FRAGILE - Breaks with text changes
page.getByText('Submit')
page.locator('text=Login')
```

### 5. **CSS/XPath** (Last Resort)
```typescript
// ❌ AVOID - Brittle, breaks with UI changes
page.locator('.btn-primary')
page.locator('#submit-btn')
page.locator('//button[@class="submit"]')
```

## Selector Rules

### ✅ DO
- Use `data-testid` for all interactive elements
- Combine role + name for better semantics
- Use partial text matching: `{ name: /submit/i }`
- Chain selectors for specificity: `page.getByRole('form').getByTestId('email')`

### ❌ DON'T
- Use CSS classes or IDs as primary selectors
- Use exact text matching (breaks with copy changes)
- Use complex XPath expressions
- Use index-based selectors: `nth(0)`

## Implementation Examples

### Form Elements
```typescript
// Input fields
await page.getByTestId('email-input').fill('user@example.com')
await page.getByRole('textbox', { name: /email/i }).fill('user@example.com')

// Buttons
await page.getByTestId('submit-btn').click()
await page.getByRole('button', { name: /submit/i }).click()

// Dropdowns
await page.getByTestId('country-select').selectOption('ID')
await page.getByRole('combobox', { name: /country/i }).selectOption('ID')
```

### Navigation
```typescript
// Links
await page.getByTestId('nav-dashboard').click()
await page.getByRole('link', { name: /dashboard/i }).click()

// Menu items
await page.getByTestId('menu-settings').click()
await page.getByRole('menuitem', { name: /settings/i }).click()
```

### Assertions
```typescript
// Visibility checks
await expect(page.getByTestId('success-message')).toBeVisible()
await expect(page.getByRole('alert')).toContainText(/success/i)

// Form validation
await expect(page.getByTestId('email-error')).toContainText('Invalid email')
```

## Migration Strategy

1. **Audit existing selectors** - Run selector validation
2. **Add data-testid to UI** - Work with frontend team
3. **Update Page Objects** - Replace brittle selectors
4. **Validate stability** - Run tests multiple times
