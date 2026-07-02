import { Given, Then, When } from './fixtures';
import { VALID_USER } from './fixtures';

Given('I am logged in as a standard user', async ({ loginPage, inventoryPage }) => {
  await loginPage.open();
  await loginPage.login(VALID_USER.username, VALID_USER.password);
  await inventoryPage.expectToBeVisible();
});

When('I add {string} to the cart', async ({ inventoryPage, testContext }, productName: string) => {
  testContext.selectedProduct = productName;
  await inventoryPage.addProductToCart(productName);
});

Given('I have added {string} to the cart', async ({ inventoryPage, testContext }, productName: string) => {
  testContext.selectedProduct = productName;
  await inventoryPage.addProductToCart(productName);
});

When('I remove {string} from the cart', async ({ inventoryPage }, productName: string) => {
  await inventoryPage.removeProductFromCart(productName);
});

Then('the cart badge should show {string} item', async ({ inventoryPage }, count: string) => {
  await inventoryPage.expectCartBadgeCount(Number(count));
});

Then('the cart badge should show {string} items', async ({ inventoryPage }, count: string) => {
  await inventoryPage.expectCartBadgeCount(Number(count));
});

Then('the cart badge should not be visible', async ({ inventoryPage }) => {
  await inventoryPage.expectCartBadgeNotVisible();
});

When('I open the cart page', async ({ inventoryPage, cartPage }) => {
  await inventoryPage.openCart();
  await cartPage.expectToBeVisible();
});

When('I refresh the page', async ({ inventoryPage }) => {
  await inventoryPage.reload();
  await inventoryPage.expectToBeVisible();
});

Then('the cart should be empty', async ({ cartPage }) => {
  await cartPage.expectCartIsEmpty();
});

Then('I should see {string} in the cart', async ({ cartPage }, productName: string) => {
  await cartPage.expectProductInCart(productName);
});
