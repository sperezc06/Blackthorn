import { expect } from '@playwright/test';
import { FakeStoreProduct } from '../helpers/FakeStoreClient';
import { Given, Then, When } from './fixtures';

Given('the FakeStore API is available', async ({ fakeStore, testContext }) => {
  const response = await fakeStore.getProducts();
  testContext.apiResponse = response;
  expect(response.ok()).toBeTruthy();
});

When('I request all products', async ({ fakeStore, testContext }) => {
  testContext.apiResponse = await fakeStore.getProducts();
});

When('I request product with id {int}', async ({ fakeStore, testContext }, id: number) => {
  testContext.apiResponse = await fakeStore.getProductById(id);
});

Then('the response status should be {int}', async ({ testContext }, status: number) => {
  expect(testContext.apiResponse).toBeDefined();
  expect(testContext.apiResponse!.status()).toBe(status);
});

Then('the response should contain a non-empty product list', async ({ testContext }) => {
  const body = (await testContext.apiResponse!.json()) as FakeStoreProduct[];
  expect(Array.isArray(body)).toBeTruthy();
  expect(body.length).toBeGreaterThan(0);
});

Then('each product should have id, title, and price fields', async ({ testContext }) => {
  const body = (await testContext.apiResponse!.json()) as FakeStoreProduct[];
  for (const product of body.slice(0, 5)) {
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('title');
    expect(product).toHaveProperty('price');
    expect(typeof product.id).toBe('number');
    expect(typeof product.title).toBe('string');
    expect(typeof product.price).toBe('number');
  }
});

Then('the response should indicate the product was not found', async ({ testContext }) => {
  const body = await testContext.apiResponse!.text();
  // FakeStore returns HTTP 200 with an empty body for non-existent product IDs.
  expect(body.trim()).toBe('');
});
