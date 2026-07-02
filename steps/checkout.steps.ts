import { Given, Then, When } from './fixtures';

When('I proceed to checkout', async ({ cartPage, checkoutPage }) => {
  await cartPage.proceedToCheckout();
  await checkoutPage.expectOnStepOne();
});

When(
  'I fill in checkout information with first name {string}, last name {string}, and postal code {string}',
  async ({ checkoutPage }, firstName: string, lastName: string, postalCode: string) => {
    await checkoutPage.fillCustomerInfo(firstName, lastName, postalCode);
  },
);

When('I continue checkout', async ({ checkoutPage }) => {
  await checkoutPage.continueCheckout();
});

When('I continue checkout without filling required fields', async ({ checkoutPage }) => {
  await checkoutPage.continueCheckout();
});

When('I finish the order', async ({ checkoutPage }) => {
  await checkoutPage.finishOrder();
});

Then('I should see the order confirmation page', async ({ checkoutPage }) => {
  await checkoutPage.expectOrderComplete();
});

Then('I should see a checkout error message {string}', async ({ checkoutPage }, message: string) => {
  await checkoutPage.expectErrorMessage(message);
});
