import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly usernameInput = this.page.locator('#user-name');
  private readonly passwordInput = this.page.locator('#password');
  private readonly loginButton = this.page.locator('#login-button');
  private readonly errorMessage = this.page.locator('[data-test="error"]');

  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.goto('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillHighlight(this.usernameInput, username, 'Username → #user-name');
    await this.fillHighlight(this.passwordInput, password, 'Password → #password');
    await this.clickHighlight(this.loginButton, 'Login → Submit');
  }

  async expectErrorVisible(): Promise<void> {
    await this.expectVisibleHighlight(this.errorMessage, 'Login error message');
  }

  async expectErrorMessage(message: string): Promise<void> {
    await this.expectVisibleHighlight(this.errorMessage, 'Login error message');
    await expect(this.errorMessage).toContainText(message);
  }
}
