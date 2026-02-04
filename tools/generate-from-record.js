#!/usr/bin/env node

/**
 * AI-powered test generation from CRX recordings
 * Usage: node tools/generate-from-record.js <record-file-path>
 */

import fs from 'fs';
import path from 'path';

class AIGenerator {
  
  async generateFromRecord(recordPath) {
    console.log(`🤖 Generating tests from: ${recordPath}`);
    
    try {
      // 1. Parse recording file
      const parsedFlow = this.parseRecording(recordPath);
      console.log(`📋 Parsed ${parsedFlow.actions.length} actions`);
      
      // 2. Determine output paths
      const paths = this.calculateOutputPaths(recordPath, parsedFlow.fileName);
      
      // 3. Generate Page Object
      const pageObjectCode = this.generatePageObject({
        className: parsedFlow.pageTitle,
        fileName: parsedFlow.fileName,
        actions: parsedFlow.actions,
        outputPath: paths.pageObjectPath
      });
      
      // 4. Generate Test
      const testCode = this.generateTest({
        testName: `Smoke - ${parsedFlow.pageTitle}`,
        fileName: parsedFlow.fileName,
        pageObjectPath: paths.pageObjectImportPath,
        pageObjectClass: parsedFlow.pageTitle,
        actions: parsedFlow.actions,
        isAuthFlow: parsedFlow.isAuthFlow
      });
      
      // 5. Write files
      await this.writeGeneratedFiles(paths, pageObjectCode, testCode);
      
      // 6. Summary
      this.printSummary(parsedFlow, paths);
      
    } catch (error) {
      console.error('❌ Generation failed:', error);
      process.exit(1);
    }
  }

  parseRecording(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath, '.record.ts');
    
    const actions = [];
    const lines = content.split('\n');
    
    let isAuthFlow = false;
    let pageTitle = this.generatePageTitle(fileName);

    for (const line of lines) {
      const trimmed = line.trim();
      
      // Skip comments and imports
      if (trimmed.startsWith('//') || trimmed.startsWith('import') || !trimmed) continue;

      // Detect auth flow
      if (trimmed.includes('login') || trimmed.includes('password') || trimmed.includes('auth')) {
        isAuthFlow = true;
      }

      // Parse different action types
      const action = this.parseAction(trimmed);
      if (action) {
        actions.push(action);
      }
    }

    return {
      fileName,
      actions,
      isAuthFlow,
      pageTitle
    };
  }

  parseAction(line) {
    // goto actions
    if (line.includes('.goto(')) {
      const urlMatch = line.match(/\.goto\(['"`]([^'"`]+)['"`]\)/);
      return {
        type: 'goto',
        url: urlMatch?.[1] || '/',
        description: `Navigate to ${urlMatch?.[1] || 'page'}`
      };
    }

    // click actions
    if (line.includes('.click()')) {
      const selector = this.extractSelector(line);
      return {
        type: 'click',
        selector,
        description: `Click ${this.describeSelectorAction(selector)}`
      };
    }

    // fill actions
    if (line.includes('.fill(')) {
      const selector = this.extractSelector(line);
      const valueMatch = line.match(/\.fill\(['"`]([^'"`]+)['"`]\)/);
      return {
        type: 'fill',
        selector,
        value: valueMatch?.[1],
        description: `Fill ${this.describeSelectorAction(selector)} with "${valueMatch?.[1]}"`
      };
    }

    return null;
  }

  extractSelector(line) {
    // Extract selector from various Playwright methods
    const patterns = [
      /getByRole\(['"`]([^'"`]+)['"`](?:,\s*\{\s*name:\s*['"`]([^'"`]+)['"`]\s*\})?/,
      /getByText\(['"`]([^'"`]+)['"`]\)/,
      /getByTestId\(['"`]([^'"`]+)['"`]\)/,
    ];

    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        if (match[2]) return `${match[1]}:${match[2]}`; // role with name
        return match[1];
      }
    }

    return 'element';
  }

  describeSelectorAction(selector) {
    if (selector.includes('Email')) return 'email field';
    if (selector.includes('Password')) return 'password field';
    if (selector.includes('Login')) return 'login button';
    return selector;
  }

  generatePageTitle(fileName) {
    // Convert kebab-case to PascalCase
    return fileName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  generatePageObject(config) {
    const { className } = config;
    
    return `import type { Page } from "@playwright/test";
import { SelectorHelper } from "../../utils/SelectorHelper";
import { SmartWait } from "../../utils/SmartWait";

export class ${className}Page {
  private selector: SelectorHelper;
  private wait: SmartWait;

  constructor(private page: Page) {
    this.selector = new SelectorHelper(page);
    this.wait = new SmartWait(page);
  }

  async fillEmail(email: string) {
    const element = await this.selector.findElement({
      testId: 'email-input',
      role: 'textbox',
      name: /email|user id/i
    });
    await this.wait.smartFill(element, email);
  }

  async fillPassword(password: string) {
    const element = await this.selector.findElement({
      testId: 'password-input',
      role: 'textbox',
      name: /password/i
    });
    await this.wait.smartFill(element, password);
  }

  async clickLogin() {
    const element = await this.selector.findElement({
      testId: 'login-button',
      role: 'button',
      text: /login|sign in/i
    });
    await this.wait.smartClick(element, { waitForNavigation: true });
  }

  async login(email: string, password: string) {
    await this.page.goto('/');
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
    await this.wait.waitForLoadingComplete();
  }
}`;
  }

  generateTest(config) {
    const { testName, pageObjectPath, pageObjectClass, isAuthFlow } = config;
    
    if (isAuthFlow) {
      return `import { test, expect } from "@playwright/test";
import { ${pageObjectClass}Page } from "${pageObjectPath}";

test("${testName} @smoke", async ({ browser }) => {
  // Auth tests use fresh context to test login flow
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    const loginPage = new ${pageObjectClass}Page(page);
    
    // Use environment credentials
    const email = process.env.USER_EMAIL!;
    const password = process.env.USER_PASSWORD!;
    
    await loginPage.login(email, password);

    // Assertions
    await expect(page.getByRole("heading")).toBeVisible();
    await expect(page).toHaveURL(/dashboard|home/i);

  } finally {
    await context.close();
  }
});`;
    }

    return `import { test, expect } from "@playwright/test";
import { ${pageObjectClass}Page } from "${pageObjectPath}";

test("${testName} @smoke", async ({ page }) => {
  await page.goto("/");

  const pageObject = new ${pageObjectClass}Page(page);
  await pageObject.performAction();

  // Assertions
  await expect(page.getByRole("heading")).toBeVisible();
  await expect(page).toHaveURL(/\\/.*\\//);
});`;
  }
  
  calculateOutputPaths(recordPath, fileName) {
    // Extract relative path from records-crx/
    const relativePath = path.relative('records-crx', recordPath);
    const dirPath = path.dirname(relativePath);
    
    // Calculate output paths
    const pageObjectDir = path.join('pages', dirPath);
    const testDir = path.join('tests/smoke', dirPath);
    
    return {
      pageObjectPath: path.join(pageObjectDir, `${fileName}.page.ts`),
      testPath: path.join(testDir, `${fileName}.spec.ts`),
      pageObjectImportPath: `../../../${pageObjectDir}/${fileName}.page`,
      pageObjectDir,
      testDir
    };
  }
  
  async writeGeneratedFiles(paths, pageObjectCode, testCode) {
    // Ensure directories exist
    fs.mkdirSync(path.dirname(paths.pageObjectPath), { recursive: true });
    fs.mkdirSync(path.dirname(paths.testPath), { recursive: true });
    
    // Write Page Object
    fs.writeFileSync(paths.pageObjectPath, pageObjectCode);
    console.log(`✅ Generated Page Object: ${paths.pageObjectPath}`);
    
    // Write Test
    fs.writeFileSync(paths.testPath, testCode);
    console.log(`✅ Generated Test: ${paths.testPath}`);
  }
  
  printSummary(parsedFlow, paths) {
    console.log('\n🎉 Generation Complete!');
    console.log('═'.repeat(50));
    console.log(`📄 Page Object: ${paths.pageObjectPath}`);
    console.log(`🧪 Test File: ${paths.testPath}`);
    console.log(`🔍 Flow Type: ${parsedFlow.isAuthFlow ? 'Authentication' : 'Feature'}`);
    console.log(`⚡ Actions: ${parsedFlow.actions.length}`);
    
    console.log('\n📝 Next Steps:');
    console.log('1. Review generated files');
    console.log('2. Add missing data-testid attributes to UI');
    console.log('3. Run test: npm run smoke');
    console.log('4. Refine selectors if needed');
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const recordPath = process.argv[2];
  
  if (!recordPath) {
    console.error('Usage: node tools/generate-from-record.js <record-file-path>');
    console.error('Example: node tools/generate-from-record.js records-crx/auth/login.record.ts');
    process.exit(1);
  }
  
  if (!fs.existsSync(recordPath)) {
    console.error(`❌ Record file not found: ${recordPath}`);
    process.exit(1);
  }
  
  const generator = new AIGenerator();
  generator.generateFromRecord(recordPath);
}
