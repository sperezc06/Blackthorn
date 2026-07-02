import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly pageTitle = this.page.locator('.title');
  readonly checkoutButton = this.page.locator('[data-test="checkout"]');
  private readonly cartItems = this.page.locator('.cart_item');

  constructor(page: Page) {
    super(page);
  }

  async expectToBeVisible(): Promise<void> {
    await this.stepHighlight('Cart page → your cart');
    await expect(this.page).toHaveURL(/.*cart\.html/);
    await this.expectVisibleHighlight(this.pageTitle, 'Cart page title');
    await expect(this.pageTitle).toHaveText('Your Cart');
  }

  async expectProductInCart(productName: string): Promise<void> {
    const item = this.cartItems.filter({ hasText: productName });
    await this.expectVisibleHighlight(item, `Cart item → ${productName}`);
  }

  async expectProductNotInCart(productName: string): Promise<void> {
    await this.stepHighlight(`Cart item absent → ${productName}`);
    await expect(this.cartItems.filter({ hasText: productName })).toHaveCount(0);
  }

  async removeProduct(productName: string): Promise<void> {
    const item = this.cartItems.filter({ hasText: productName });
    const removeButton = item.locator('button').filter({ hasText: 'Remove' });
    await this.clickHighlight(removeButton, `Remove from cart page → ${productName}`);
  }

  async expectCartIsEmpty(): Promise<void> {
    await this.stepHighlight('Cart → empty');
    await expect(this.cartItems).toHaveCount(0);
  }

  async proceedToCheckout(): Promise<void> {
    await this.clickHighlight(this.checkoutButton, 'Checkout → Continue');
  }
}
