# Selector Strategy & Data-TestId Guide

## Priority Order (Best to Worst)

1. **data-testid** (Highest) - `page.getByTestId('submit-button')`
2. **Role + Name** - `page.getByRole('button', { name: 'Submit' })`
3. **Label/Placeholder** - `page.getByLabel('Email')`
4. **Text Content** - `page.getByText('Submit')` (fragile)
5. **CSS/XPath** - Avoid (brittle)

## Data-TestId Naming Convention

### Pattern: `{component}-{element}-{action?}`

```html
<!-- Authentication -->
<input data-testid="auth-email-input" />
<button data-testid="auth-login-button">Login</button>

<!-- Navigation -->
<a data-testid="nav-dashboard-link">Dashboard</a>

<!-- Forms -->
<input data-testid="form-name-input" />
<button data-testid="form-submit-button">Submit</button>

<!-- Messages -->
<div data-testid="message-success">Success!</div>
<div data-testid="message-error">Error</div>

<!-- Tables -->
<table data-testid="table-users">
  <button data-testid="table-add-button">Add</button>
</table>

<!-- Modals -->
<div data-testid="modal-confirm">
  <button data-testid="modal-ok-button">OK</button>
</div>
```

## Implementation Examples

```typescript
// Input fields
await page.getByTestId('email-input').fill('user@example.com')
await page.getByRole('textbox', { name: /email/i }).fill('user@example.com')

// Buttons
await page.getByTestId('submit-btn').click()
await page.getByRole('button', { name: /submit/i }).click()

// Assertions
await expect(page.getByTestId('success-message')).toBeVisible()
await expect(page.getByRole('alert')).toContainText(/success/i)
```

## Framework Integration

### React
```jsx
<input data-testid="auth-email-input" type="email" />
<button data-testid="auth-submit-button">Login</button>
```

### Vue
```vue
<input data-testid="auth-email-input" type="email" />
<button data-testid="auth-submit-button">Login</button>
```

### Angular
```html
<input data-testid="auth-email-input" type="email" />
<button data-testid="auth-submit-button">Login</button>
```
