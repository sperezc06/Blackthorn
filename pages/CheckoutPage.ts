import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  private readonly firstNameInput = this.page.locator('[data-test="firstName"]');
  private readonly lastNameInput = this.page.locator('[data-test="lastName"]');
  private readonly postalCodeInput = this.page.locator('[data-test="postalCode"]');
  private readonly continueButton = this.page.locator('[data-test="continue"]');
  private readonly finishButton = this.page.locator('[data-test="finish"]');
  private readonly errorMessage = this.page.locator('[data-test="error"]');
  private readonly completeHeader = this.page.locator('.complete-header');

  constructor(page: Page) {
    super(page);
  }

  async expectOnStepOne(): Promise<void> {
    await this.stepHighlight('Checkout → step one');
    await expect(this.page).toHaveURL(/.*checkout-step-one\.html/);
  }

  async fillCustomerInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fillHighlight(this.firstNameInput, firstName, 'First name → checkout form');
    await this.fillHighlight(this.lastNameInput, lastName, 'Last name → checkout form');
    await this.fillHighlight(this.postalCodeInput, postalCode, 'Postal code → checkout form');
  }

  async continueCheckout(): Promise<void> {
    await this.clickHighlight(this.continueButton, 'Continue → checkout step two');
  }

  async finishOrder(): Promise<void> {
    await this.clickHighlight(this.finishButton, 'Finish → order complete');
  }

  async expectErrorMessage(message: string): Promise<void> {
    await this.expectVisibleHighlight(this.errorMessage, 'Checkout error message');
    await expect(this.errorMessage).toContainText(message);
  }

  async expectOrderComplete(): Promise<void> {
    await this.stepHighlight('Order complete → confirmation');
    await expect(this.page).toHaveURL(/.*checkout-complete\.html/);
    await this.expectVisibleHighlight(this.completeHeader, 'Thank you message');
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }
}
