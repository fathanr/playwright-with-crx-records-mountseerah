import { Page, Locator } from '@playwright/test';

/**
 * Smart Wait Helper - Replace hard waits with intelligent waiting strategies
 */
export class SmartWait {
  constructor(private page: Page) {}

  /**
   * Wait for network to be idle (no requests for specified time)
   */
  async waitForNetworkIdle(timeout = 5000) {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Wait for element to be ready for interaction
   */
  async waitForElement(locator: Locator, options?: {
    state?: 'visible' | 'attached' | 'detached' | 'hidden';
    timeout?: number;
  }) {
    const { state = 'visible', timeout = 10000 } = options || {};
    await locator.waitFor({ state, timeout });
  }

  /**
   * Wait for loading spinner to disappear
   */
  async waitForLoadingComplete(spinnerSelector?: string) {
    const selectors = [
      spinnerSelector,
      '[data-testid="loading-spinner"]',
      '[data-testid="page-loader"]',
      '.loading',
      '.spinner'
    ].filter(Boolean);

    for (const selector of selectors) {
      try {
        await this.page.waitForSelector(selector!, { state: 'detached', timeout: 2000 });
        return;
      } catch {
        // Continue to next selector
      }
    }
  }

  /**
   * Wait for form submission to complete
   */
  async waitForFormSubmission(options?: {
    successSelector?: string;
    errorSelector?: string;
    timeout?: number;
  }) {
    const { 
      successSelector = '[data-testid="success-message"]',
      errorSelector = '[data-testid="error-message"]',
      timeout = 15000 
    } = options || {};

    try {
      // Wait for either success or error message
      await Promise.race([
        this.page.waitForSelector(successSelector, { timeout }),
        this.page.waitForSelector(errorSelector, { timeout })
      ]);
    } catch {
      // Fallback: wait for network idle
      await this.waitForNetworkIdle();
    }
  }

  /**
   * Smart click with automatic waiting
   */
  async smartClick(locator: Locator, options?: {
    waitForNavigation?: boolean;
    waitForResponse?: boolean;
  }) {
    const { waitForNavigation = false, waitForResponse = false } = options || {};

    // Wait for element to be ready
    await this.waitForElement(locator);

    if (waitForNavigation) {
      await Promise.all([
        this.page.waitForLoadState('networkidle'),
        locator.click()
      ]);
    } else if (waitForResponse) {
      await Promise.all([
        this.page.waitForResponse(resp => resp.status() < 400),
        locator.click()
      ]);
    } else {
      await locator.click();
    }
  }

  /**
   * Smart fill with validation
   */
  async smartFill(locator: Locator, value: string, options?: {
    clearFirst?: boolean;
    validateFill?: boolean;
  }) {
    const { clearFirst = true, validateFill = true } = options || {};

    await this.waitForElement(locator);
    
    if (clearFirst) {
      await locator.clear();
    }
    
    await locator.fill(value);

    if (validateFill) {
      const actualValue = await locator.inputValue();
      if (actualValue !== value) {
        throw new Error(`Fill validation failed. Expected: "${value}", Got: "${actualValue}"`);
      }
    }
  }
}
