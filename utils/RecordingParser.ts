import fs from 'fs';
import path from 'path';

interface ParsedAction {
  type: 'goto' | 'click' | 'fill' | 'select' | 'wait' | 'expect';
  selector?: string;
  value?: string;
  url?: string;
  description: string;
}

interface ParsedFlow {
  fileName: string;
  actions: ParsedAction[];
  isAuthFlow: boolean;
  pageTitle: string;
}

export class RecordingParser {
  
  /**
   * Parse Playwright recording file and extract actions
   */
  static parseRecording(filePath: string): ParsedFlow {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath, '.record.ts');
    
    const actions: ParsedAction[] = [];
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

  private static parseAction(line: string): ParsedAction | null {
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

    // select actions
    if (line.includes('.selectOption(')) {
      const selector = this.extractSelector(line);
      const valueMatch = line.match(/\.selectOption\(['"`]([^'"`]+)['"`]\)/);
      return {
        type: 'select',
        selector,
        value: valueMatch?.[1],
        description: `Select "${valueMatch?.[1]}" from ${this.describeSelectorAction(selector)}`
      };
    }

    // expect actions
    if (line.includes('expect(')) {
      const selector = this.extractSelector(line);
      return {
        type: 'expect',
        selector,
        description: `Verify ${this.describeSelectorAction(selector)}`
      };
    }

    return null;
  }

  private static extractSelector(line: string): string {
    // Extract selector from various Playwright methods
    const patterns = [
      /getByTestId\(['"`]([^'"`]+)['"`]\)/,
      /getByRole\(['"`]([^'"`]+)['"`](?:,\s*\{\s*name:\s*['"`]([^'"`]+)['"`]\s*\})?/,
      /getByText\(['"`]([^'"`]+)['"`]\)/,
      /getByLabel\(['"`]([^'"`]+)['"`]\)/,
      /locator\(['"`]([^'"`]+)['"`]\)/
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

  private static describeSelectorAction(selector: string): string {
    if (selector.includes('email')) return 'email field';
    if (selector.includes('password')) return 'password field';
    if (selector.includes('login') || selector.includes('submit')) return 'login button';
    if (selector.includes('save')) return 'save button';
    if (selector.includes('create')) return 'create button';
    if (selector.includes('cancel')) return 'cancel button';
    return selector;
  }

  private static generatePageTitle(fileName: string): string {
    // Convert kebab-case to PascalCase
    return fileName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }
}
