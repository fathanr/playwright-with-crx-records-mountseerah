# Selector Improvement Suggestions (from login.record.ts)

- Add `data-testid="login-email"` to the Email or User ID textbox
- Add `data-testid="login-password"` to the Password textbox
- Add `data-testid="login-submit"` to the Login button
- Add `data-testid="menu-ptp-bill"` to the PTP bill-icon button
- Add `data-testid="user-menu"` to the user admin button
- Add `data-testid="dialog-ok"` to the OK button

# Selector Improvement Suggestions (from master-description/search-description.record.ts)

- Add `data-testid="menu-mr-bill"` to the MR bill-icon button
- Add `data-testid="user-menu"` to the user admin mr button
- Add `data-testid="dialog-ok"` to the OK button
- Add `data-testid="menu-master-data"` to the Master Data text/link
- Add `data-testid="menu-description"` to the Description link
- Add `data-testid="description-search"` to the Search textbox
- Add `data-testid="description-id-header"` to the Description ID column header
- Add `data-testid="description-row"` or `data-testid="description-cell-{id}"` to the result cell for row selection

# Selector Improvement Suggestions (from master-description/create-entity-district.record.ts)

- Add `data-testid="toast-success"` or `data-testid="entity-district-create-success"` to the "Successfully created Entity" message so tests do not rely on `div` + `nth(4)`
- Entity District link: add `data-testid="menu-entity-district"` for consistency with other menu items

# Selector Improvement Suggestions (from auth/login-admin-mr.record.ts)

- Add `data-testid="menu-mr-bill"` to the MR bill-icon button
- Add `data-testid="user-admin-mr"` to the user admin mr button
- Add `data-testid="dialog-ok"` to the OK button
- Add `data-testid="menu-dashboard"` to the Dashboard element
