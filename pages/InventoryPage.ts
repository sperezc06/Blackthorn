import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  private readonly pageTitle = this.page.locator('.title');
  private readonly cartBadge = this.page.locator('.shopping_cart_badge');
  private readonly cartLink = this.page.locator('.shopping_cart_link');

  constructor(page: Page) {
    super(page);
  }

  async expectToBeVisible(): Promise<void> {
    await this.stepHighlight('Products page → inventory');
    await expect(this.page).toHaveURL(/.*inventory\.html/);
    await this.expectVisibleHighlight(this.pageTitle, 'Products page title');
    await expect(this.pageTitle).toHaveText('Products');
  }

  async addProductToCart(productName: string): Promise<void> {
    const productContainer = this.page.locator('.inventory_item').filter({
      has: this.page.locator('.inventory_item_name', { hasText: productName }),
    });
    const addButton = productContainer.locator('button').filter({ hasText: 'Add to cart' });
    await this.clickHighlight(addButton, `Add to cart → ${productName}`);
  }

  async removeProductFromCart(productName: string): Promise<void> {
    const productContainer = this.page.locator('.inventory_item').filter({
      has: this.page.locator('.inventory_item_name', { hasText: productName }),
    });
    const removeButton = productContainer.locator('button').filter({ hasText: 'Remove' });
    await this.clickHighlight(removeButton, `Remove from cart → ${productName}`);
  }

  async expectCartBadgeCount(count: number): Promise<void> {
    await this.expectVisibleHighlight(this.cartBadge, `Cart badge → ${count} item(s)`);
    await expect(this.cartBadge).toHaveText(String(count));
  }

  async expectCartBadgeNotVisible(): Promise<void> {
    await this.stepHighlight('Cart badge → hidden');
    await expect(this.cartBadge).not.toBeVisible();
  }

  async openCart(): Promise<void> {
    await this.clickHighlight(this.cartLink, 'Open cart → cart icon');
  }
}
