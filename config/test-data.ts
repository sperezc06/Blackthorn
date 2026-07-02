export const BASE_URL = process.env.BASE_URL ?? 'https://www.saucedemo.com';
export const FAKESTORE_URL = process.env.FAKESTORE_URL ?? 'https://fakestoreapi.com';

export const USERS = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  lockedOut: { username: 'locked_out_user', password: 'secret_sauce' },
  invalid: { username: 'invalid_user', password: 'wrong_password' },
} as const;

export const PRODUCTS = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
} as const;

export const CHECKOUT = {
  firstName: 'John',
  lastName: 'Doe',
  postalCode: '12345',
} as const;

export const MESSAGES = {
  invalidLogin: 'Epic sadface: Username and password do not match any user in this service',
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  missingFirstName: 'Error: First Name is required',
} as const;
