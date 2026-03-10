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
      this.page.getByRole("button", { name: /log in|sign in/i })
    );
  }

  get errorMessage() {
    return this.page.getByTestId("error-message").or(
      this.page.getByRole("alert").or(
        this.page.locator(".error-message, .alert, [data-testid*='error']")
      )
    );
  }

  async getErrorMessage(): Promise<string> {
    if (await this.errorMessage.count() > 0) {
      return await this.errorMessage.textContent() || "";
    }
    return "";
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    
    // Wait for navigation away from login page
    await this.page.waitForURL(url => !url.toString().includes('/login'), { timeout: 30000 });
  }
}
