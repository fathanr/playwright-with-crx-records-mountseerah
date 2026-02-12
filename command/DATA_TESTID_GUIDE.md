# Data-TestId Implementation Guide

## General Naming Convention

### Pattern: `{component}-{element}-{action?}`

**Components:**
- `auth` - Authentication related
- `nav` - Navigation elements  
- `form` - Form elements
- `modal` - Modal/dialog elements
- `table` - Table/list elements
- `card` - Card/container elements

**Elements:**
- `input`, `button`, `link`, `select`, `textarea`
- `message`, `error`, `success`, `warning`
- `loader`, `spinner`, `icon`

**Actions (optional):**
- `submit`, `cancel`, `save`, `delete`, `edit`, `view`

### Examples
```html
<!-- Authentication -->
<input data-testid="auth-email-input" />
<button data-testid="auth-login-button">Login</button>

<!-- Navigation -->
<a data-testid="nav-dashboard-link">Dashboard</a>
<button data-testid="nav-menu-toggle">Menu</button>

<!-- Forms -->
<form data-testid="form-user-create">
  <input data-testid="form-name-input" />
  <button data-testid="form-submit-button">Submit</button>
  <button data-testid="form-cancel-button">Cancel</button>
</form>

<!-- Messages -->
<div data-testid="message-success">Success!</div>
<div data-testid="message-error">Error occurred</div>

<!-- Tables -->
<table data-testid="table-users">
  <button data-testid="table-add-button">Add User</button>
  <button data-testid="table-edit-button">Edit</button>
  <button data-testid="table-delete-button">Delete</button>
</table>

<!-- Modals -->
<div data-testid="modal-confirm">
  <button data-testid="modal-ok-button">OK</button>
  <button data-testid="modal-cancel-button">Cancel</button>
</div>
```

## Implementation Priority

### Critical (Must Have)
- Primary actions: submit, save, login, logout
- Form inputs: text, email, password, select
- Navigation: main menu, breadcrumbs
- Messages: success, error, validation

### Important (Should Have)  
- Secondary actions: edit, delete, cancel
- Modal dialogs: confirm, alert
- Loading states: spinner, progress
- Search and filters

### Optional (Nice to Have)
- Decorative elements
- Static content
- Third-party widgets
- Analytics elements

## Best Practices

### ✅ DO
```html
<!-- Descriptive and consistent -->
<button data-testid="user-save-button">Save User</button>
<input data-testid="product-name-input" placeholder="Product Name" />

<!-- Use kebab-case -->
<div data-testid="order-summary-card">...</div>

<!-- Include context -->
<button data-testid="modal-confirm-delete-button">Delete</button>
```

### ❌ DON'T
```html
<!-- Too generic -->
<button data-testid="btn1">Save</button>
<input data-testid="input" />

<!-- Inconsistent naming -->
<div data-testid="orderSummary">...</div>
<div data-testid="order_details">...</div>

<!-- No context -->
<button data-testid="ok">OK</button>
```

## Framework Integration

### React
```jsx
function LoginForm() {
  return (
    <form data-testid="auth-login-form">
      <input data-testid="auth-email-input" type="email" />
      <input data-testid="auth-password-input" type="password" />
      <button data-testid="auth-submit-button">Login</button>
    </form>
  );
}
```

### Vue
```vue
<template>
  <form data-testid="auth-login-form">
    <input data-testid="auth-email-input" type="email" />
    <input data-testid="auth-password-input" type="password" />
    <button data-testid="auth-submit-button">Login</button>
  </form>
</template>
```

### Angular
```html
<form data-testid="auth-login-form">
  <input data-testid="auth-email-input" type="email" />
  <input data-testid="auth-password-input" type="password" />
  <button data-testid="auth-submit-button">Login</button>
</form>
```

## Benefits

### For Developers
- **Stable tests** - Don't break with CSS/styling changes
- **Clear intent** - Shows what functionality is being tested
- **Better debugging** - Easy to identify test failures
- **Documentation** - Self-documenting test scenarios

### For QA/Test Engineers
- **Reliable selectors** - Consistent across environments
- **Faster test writing** - Predictable element identification
- **Easier maintenance** - Less brittle test code
- **Better coverage** - Can target specific functionality

### For Product Teams
- **Faster releases** - Less test maintenance overhead
- **Higher confidence** - More stable automated testing
- **Better quality** - Consistent testing standards
- **Reduced costs** - Less manual testing needed
