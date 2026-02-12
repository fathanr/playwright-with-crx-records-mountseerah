import type { Page } from "@playwright/test";

export class LoginPage {
  constructor(private page: Page) {}

  get emailInput() {
    return this.page.getByTestId("email-input").or(
      this.page.getByRole("textbox", { name: /email|username|user/i })
    );
  }

  get passwordInput() {
    return this.page.getByTestId("password-input").or(
      this.page.getByRole("textbox", { name: /password/i })
    );
  }

  get loginButton() {
    return this.page.getByTestId("login-button").or(
      this.page.getByRole("button", { name: /login|sign in/i })
    );
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    
    // Wait for navigation away from login page
    await this.page.waitForURL(url => !url.toString().includes('/auth/'), { timeout: 30000 });
  }
}
