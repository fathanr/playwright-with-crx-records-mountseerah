import { ParsedAction } from './RecordingParser';

interface TestConfig {
  testName: string;
  fileName: string;
  pageObjectPath: string;
  pageObjectClass: string;
  actions: ParsedAction[];
  isAuthFlow: boolean;
}

export class TestGenerator {
  
  /**
   * Generate smoke test from parsed actions
   */
  static generateTest(config: TestConfig): string {
    const { testName, pageObjectPath, pageObjectClass, actions, isAuthFlow } = config;
    
    const imports = this.generateImports(pageObjectPath, pageObjectClass, isAuthFlow);
    const testStructure = this.generateTestStructure(testName, pageObjectClass, actions, isAuthFlow);

    return `${imports}

${testStructure}`;
  }

  private static generateImports(pageObjectPath: string, pageObjectClass: string, isAuthFlow: boolean): string {
    const baseImports = `import { test, expect } from "@playwright/test";
import { ${pageObjectClass}Page } from "${pageObjectPath}";`;

    if (!isAuthFlow) {
      return `${baseImports}
import { DataCleanup } from "../../../utils/DataCleanup";`;
    }

    return baseImports;
  }

  private static generateTestStructure(testName: string, pageObjectClass: string, actions: ParsedAction[], isAuthFlow: boolean): string {
    if (isAuthFlow) {
      return this.generateAuthTest(testName, pageObjectClass, actions);
    } else {
      return this.generateFeatureTest(testName, pageObjectClass, actions);
    }
  }

  private static generateAuthTest(testName: string, pageObjectClass: string, actions: ParsedAction[]): string {
    const assertions = this.generateAssertions(actions);
    
    return `test("${testName} @smoke", async ({ browser }) => {
  // Auth tests use fresh context to test login flow
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto("/");

    const ${this.camelCase(pageObjectClass)} = new ${pageObjectClass}Page(page);
    
    // Use environment credentials
    const email = process.env.USER_EMAIL!;
    const password = process.env.USER_PASSWORD!;
    
    await ${this.camelCase(pageObjectClass)}.login(email, password);

    // Assertions
${assertions}

  } finally {
    await context.close();
  }
});`;
  }

  private static generateFeatureTest(testName: string, pageObjectClass: string, actions: ParsedAction[]): string {
    const assertions = this.generateAssertions(actions);
    const fillActions = actions.filter(a => a.type === 'fill');
    const hasDataCreation = fillActions.length > 0;
    
    return `test("${testName} @smoke", async ({ page }) => {
  ${hasDataCreation ? 'const cleanup = new DataCleanup(page);' : ''}
  
  try {
    await page.goto("/");

    const ${this.camelCase(pageObjectClass)} = new ${pageObjectClass}Page(page);
    ${hasDataCreation ? 'const result = ' : ''}await ${this.camelCase(pageObjectClass)}.${this.generateMainMethodCall(pageObjectClass, fillActions)};

    // Assertions
${assertions}
    ${hasDataCreation ? 'if (result) await expect(page.getByText(result.name || result.entity || result.description)).toBeVisible();' : ''}

  } ${hasDataCreation ? `finally {
    // Cleanup created test data
    await cleanup.cleanupEntities();
  }` : ''}
});`;
  }

  private static generateAssertions(actions: ParsedAction[]): string {
    const expectations = actions.filter(a => a.type === 'expect');
    
    if (expectations.length > 0) {
      return expectations.map(exp => 
        `    await expect(page.getByText("${this.extractExpectedText(exp.selector)}")).toBeVisible();`
      ).join('\n');
    }

    // Default assertions based on action types
    const hasSubmit = actions.some(a => a.type === 'click' && (a.selector?.includes('submit') || a.selector?.includes('save')));
    
    if (hasSubmit) {
      return `    await expect(page.getByText(/success|created|saved/i)).toBeVisible();
    await expect(page).toHaveURL(/\\/.*\\//); // Verify navigation`;
    }

    return `    await expect(page.getByRole("heading")).toBeVisible();
    await expect(page).toHaveURL(/\\/.*\\//);`;
  }

  private static generateMainMethodCall(pageObjectClass: string, fillActions: ParsedAction[]): string {
    const methodName = this.generateMainMethodName(pageObjectClass);
    
    if (fillActions.length === 0) {
      return `${methodName}()`;
    }

    // Use DataFactory for dynamic data
    return `${methodName}()`;
  }

  private static generateMainMethodName(pageObjectClass: string): string {
    const className = pageObjectClass.toLowerCase();
    
    if (className.includes('login')) return 'login';
    if (className.includes('create')) return 'create';
    if (className.includes('edit')) return 'edit';
    if (className.includes('delete')) return 'delete';
    
    return 'performAction';
  }

  private static extractExpectedText(selector?: string): string {
    if (!selector) return 'Success';
    
    if (selector.includes('success')) return 'Success';
    if (selector.includes('error')) return 'Error';
    if (selector.includes('created')) return 'Created';
    if (selector.includes('saved')) return 'Saved';
    
    return 'Success';
  }

  private static camelCase(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }
}
