import { expect } from '@playwright/test';
import { USERS } from '../config/test-data';
import { Given, Then, When } from './fixtures';

Given('I am on the login page', async ({ loginPage }) => {
  await loginPage.open();
});

When('I log in with valid credentials', async ({ loginPage }) => {
  await loginPage.login(USERS.standard.username, USERS.standard.password);
});

When('I log in with invalid credentials', async ({ loginPage }) => {
  await loginPage.login(USERS.invalid.username, USERS.invalid.password);
});

When('I log in as a locked-out user', async ({ loginPage }) => {
  await loginPage.login(USERS.lockedOut.username, USERS.lockedOut.password);
});

When(
  'I log in with username {string} and password {string}',
  async ({ loginPage }, username: string, password: string) => {
    await loginPage.login(username, password);
  },
);

Then('I should see the products page', async ({ inventoryPage }) => {
  await inventoryPage.expectToBeVisible();
});

Then('I should see a login error message', async ({ loginPage }) => {
  await loginPage.expectErrorVisible();
});

Then('I should see a login error message {string}', async ({ loginPage }, message: string) => {
  await loginPage.expectErrorMessage(message);
});
