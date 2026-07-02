import { APIResponse } from '@playwright/test';
import { test as base, createBdd } from 'playwright-bdd';
import { FAKESTORE_URL, PRODUCTS, USERS } from '../config/test-data';
import { FakeStoreClient } from '../helpers/FakeStoreClient';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';

export interface TestContext {
  apiResponse?: APIResponse;
  selectedProduct?: string;
}

export const test = base.extend<{
  testContext: TestContext;
  fakeStore: FakeStoreClient;
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
}>({
  testContext: async ({}, use) => {
    await use({});
  },
  fakeStore: async ({ playwright }, use) => {
    const api = await playwright.request.newContext({
      baseURL: FAKESTORE_URL,
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      extraHTTPHeaders: {
        Accept: 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    await use(new FakeStoreClient(api));
    await api.dispose();
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

export const { Given, When, Then } = createBdd(test);

export const VALID_USER = USERS.standard;
export const DEFAULT_PRODUCT = PRODUCTS.backpack;
