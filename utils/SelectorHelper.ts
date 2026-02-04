import { Page } from '@playwright/test';

/**
 * Selector Helper - Smart selector utilities with fallback strategies
 */
export class SelectorHelper {
  constructor(private page: Page) {}

  /**
   * Smart element finder with fallback chain
   * Priority: data-testid > role+name > label > text > css
   */
  async findElement(options: {
    testId?: string;
    role?: string;
    name?: string | RegExp;
    label?: string | RegExp;
    text?: string | RegExp;
    css?: string;
  }) {
    const { testId, role, name, label, text, css } = options;

    // 1. Try data-testid first (highest priority)
    if (testId) {
      const element = this.page.getByTestId(testId);
      if (await element.count() > 0) return element;
    }

    // 2. Try role + name combination
    if (role && name) {
      const element = this.page.getByRole(role as any, { name });
      if (await element.count() > 0) return element;
    }

    // 3. Try label
    if (label) {
      const element = this.page.getByLabel(label);
      if (await element.count() > 0) return element;
    }

    // 4. Try text content
    if (text) {
      const element = this.page.getByText(text);
      if (await element.count() > 0) return element;
    }

    // 5. Last resort: CSS selector
    if (css) {
      const element = this.page.locator(css);
      if (await element.count() > 0) return element;
    }

    throw new Error(`Element not found with options: ${JSON.stringify(options)}`);
  }

  /**
   * Smart click with retry and wait strategies
   */
  async smartClick(options: Parameters<typeof this.findElement>[0]) {
    const element = await this.findElement(options);
    
    // Wait for element to be actionable
    await element.waitFor({ state: 'visible' });
    await element.waitFor({ state: 'attached' });
    
    // Click with retry
    await element.click({ timeout: 10000 });
  }

  /**
   * Smart fill with validation
   */
  async smartFill(options: Parameters<typeof this.findElement>[0], value: string) {
    const element = await this.findElement(options);
    
    await element.waitFor({ state: 'visible' });
    await element.clear();
    await element.fill(value);
    
    // Validate the value was filled
    const filledValue = await element.inputValue();
    if (filledValue !== value) {
      throw new Error(`Failed to fill value. Expected: ${value}, Got: ${filledValue}`);
    }
  }

  /**
   * Validate selector stability - check if element exists
   */
  async validateSelector(options: Parameters<typeof this.findElement>[0]): Promise<{
    found: boolean;
    method: string;
    count: number;
  }> {
    const { testId, role, name, label, text, css } = options;

    if (testId) {
      const count = await this.page.getByTestId(testId).count();
      if (count > 0) return { found: true, method: 'data-testid', count };
    }

    if (role && name) {
      const count = await this.page.getByRole(role as any, { name }).count();
      if (count > 0) return { found: true, method: 'role+name', count };
    }

    if (label) {
      const count = await this.page.getByLabel(label).count();
      if (count > 0) return { found: true, method: 'label', count };
    }

    if (text) {
      const count = await this.page.getByText(text).count();
      if (count > 0) return { found: true, method: 'text', count };
    }

    if (css) {
      const count = await this.page.locator(css).count();
      if (count > 0) return { found: true, method: 'css', count };
    }

    return { found: false, method: 'none', count: 0 };
  }
}
