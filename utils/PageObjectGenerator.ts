import { ParsedAction } from './RecordingParser';

interface PageObjectConfig {
  className: string;
  fileName: string;
  actions: ParsedAction[];
  outputPath: string;
}

export class PageObjectGenerator {
  
  /**
   * Generate Page Object class from parsed actions
   */
  static generatePageObject(config: PageObjectConfig): string {
    const { className, actions } = config;
    
    const imports = this.generateImports();
    const classDeclaration = this.generateClassDeclaration(className);
    const methods = this.generateMethods(actions);
    const mainMethod = this.generateMainMethod(actions, className);

    return `${imports}

${classDeclaration}
${methods}
${mainMethod}
}`;
  }

  private static generateImports(): string {
    return `import type { Page } from "@playwright/test";
import { SelectorHelper } from "../../utils/SelectorHelper";
import { SmartWait } from "../../utils/SmartWait";
import { DataFactory } from "../../utils/DataFactory";`;
  }

  private static generateClassDeclaration(className: string): string {
    return `export class ${className}Page {
  private selector: SelectorHelper;
  private wait: SmartWait;

  constructor(private page: Page) {
    this.selector = new SelectorHelper(page);
    this.wait = new SmartWait(page);
  }`;
  }

  private static generateMethods(actions: ParsedAction[]): string {
    const methods: string[] = [];
    const processedActions = new Set<string>();

    for (const action of actions) {
      if (action.type === 'goto') continue; // Handle in main method
      
      const methodName = this.generateMethodName(action);
      const methodKey = `${methodName}-${action.type}`;
      
      if (processedActions.has(methodKey)) continue;
      processedActions.add(methodKey);

      const method = this.generateMethod(action, methodName);
      methods.push(method);
    }

    return methods.join('\n\n');
  }

  private static generateMethod(action: ParsedAction, methodName: string): string {
    const { type, selector, value } = action;

    switch (type) {
      case 'click':
        return `  async ${methodName}() {
    const element = await this.selector.findElement({
      testId: '${this.generateTestId(selector)}',
      role: 'button',
      text: /${this.extractTextFromSelector(selector)}/i
    });
    await this.wait.smartClick(element);
  }`;

      case 'fill':
        return `  async ${methodName}(${this.generateParameterName(selector)}: string) {
    const element = await this.selector.findElement({
      testId: '${this.generateTestId(selector)}',
      role: 'textbox',
      label: /${this.extractTextFromSelector(selector)}/i
    });
    await this.wait.smartFill(element, ${this.generateParameterName(selector)});
  }`;

      case 'select':
        return `  async ${methodName}(value: string) {
    const element = await this.selector.findElement({
      testId: '${this.generateTestId(selector)}',
      role: 'combobox',
      label: /${this.extractTextFromSelector(selector)}/i
    });
    await element.selectOption(value);
  }`;

      default:
        return `  async ${methodName}() {
    // TODO: Implement ${action.description}
  }`;
    }
  }

  private static generateMainMethod(actions: ParsedAction[], className: string): string {
    const gotoAction = actions.find(a => a.type === 'goto');
    const fillActions = actions.filter(a => a.type === 'fill');
    const clickActions = actions.filter(a => a.type === 'click' && !a.selector?.includes('submit') && !a.selector?.includes('save'));
    const submitAction = actions.find(a => a.type === 'click' && (a.selector?.includes('submit') || a.selector?.includes('save') || a.selector?.includes('login')));

    const parameters = fillActions.map(action => 
      `${this.generateParameterName(action.selector!)}: string`
    ).join(', ');

    const methodCalls = [
      gotoAction ? `await this.page.goto('${gotoAction.url}');` : '',
      ...clickActions.map(action => `await this.${this.generateMethodName(action)}();`),
      ...fillActions.map(action => `await this.${this.generateMethodName(action)}(${this.generateParameterName(action.selector!)});`),
      submitAction ? `await this.${this.generateMethodName(submitAction)}();` : '',
      'await this.wait.waitForLoadingComplete();'
    ].filter(Boolean);

    const mainMethodName = this.generateMainMethodName(className);

    return `
  async ${mainMethodName}(${parameters}) {
    ${methodCalls.join('\n    ')}
  }`;
  }

  private static generateMethodName(action: ParsedAction): string {
    const { type, selector } = action;
    
    if (type === 'click') {
      if (selector?.includes('submit') || selector?.includes('save')) return 'clickSubmit';
      if (selector?.includes('login')) return 'clickLogin';
      if (selector?.includes('create')) return 'clickCreate';
      if (selector?.includes('cancel')) return 'clickCancel';
      return 'clickButton';
    }
    
    if (type === 'fill') {
      if (selector?.includes('email')) return 'fillEmail';
      if (selector?.includes('password')) return 'fillPassword';
      if (selector?.includes('name')) return 'fillName';
      if (selector?.includes('description')) return 'fillDescription';
      return 'fillField';
    }

    return `perform${type.charAt(0).toUpperCase() + type.slice(1)}`;
  }

  private static generateMainMethodName(className: string): string {
    if (className.toLowerCase().includes('login')) return 'login';
    if (className.toLowerCase().includes('create')) return 'create';
    if (className.toLowerCase().includes('edit')) return 'edit';
    if (className.toLowerCase().includes('delete')) return 'delete';
    return 'performAction';
  }

  private static generateTestId(selector?: string): string {
    if (!selector) return 'element';
    
    // Convert selector to test-id format
    return selector
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private static generateParameterName(selector?: string): string {
    if (!selector) return 'value';
    
    if (selector.includes('email')) return 'email';
    if (selector.includes('password')) return 'password';
    if (selector.includes('name')) return 'name';
    if (selector.includes('description')) return 'description';
    
    return 'value';
  }

  private static extractTextFromSelector(selector?: string): string {
    if (!selector) return 'element';
    
    // Extract meaningful text from selector
    return selector.replace(/[^a-zA-Z\s]/g, ' ').trim() || 'element';
  }
}
