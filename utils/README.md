# Helper Utilities

Optional helper utilities for advanced test scenarios.

## Available Utilities

### SmartWait.ts
Intelligent waiting strategies for dynamic content:
- Wait for network idle
- Wait for loading indicators
- Wait for form submissions

### SelectorHelper.ts
Selector validation and helpers:
- Find elements with fallback strategies
- Smart click with retry
- Smart fill with validation

### WaitConfig.ts
Centralized timeout configurations:
- Environment-based timeouts
- Consistent wait durations across tests

## Usage

Import in your page objects or tests:

```typescript
import { SmartWait } from "../../utils/SmartWait";
import { SelectorHelper } from "../../utils/SelectorHelper";

export class FeaturePage {
  private smartWait: SmartWait;
  private selector: SelectorHelper;

  constructor(private page: Page) {
    this.smartWait = new SmartWait(page);
    this.selector = new SelectorHelper(page);
  }

  async performAction() {
    await this.smartWait.waitForLoadingComplete();
    await this.selector.smartClick('[data-testid="submit"]');
  }
}
```

## Optional

These utilities are **optional**. You can:
- Use them for complex scenarios
- Delete them if not needed
- Customize based on your needs

## AI Generation

AI-generated tests use basic Playwright methods by default. You can manually integrate these utilities if needed.
