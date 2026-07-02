# Test Scenarios — Gherkin (Task 2)

**Application:** https://www.saucedemo.com  
**Format:** Given / When / Then

Automated versions live in `features/`. Steps may use explicit test data where the design doc uses generic wording (e.g. valid credentials → `standard_user` / `secret_sauce`).

---

## Positive Scenarios

### Scenario: Successful login

- Given I am on the login page
- When I log in with valid credentials
- Then I should see the products page

### Scenario: Add item to cart

- Given I am logged in as a standard user
- When I add "Sauce Labs Backpack" to the cart
- Then the cart badge should show "1" item

### Scenario: Remove item from cart

- Given I am logged in as a standard user
- And I have added "Sauce Labs Backpack" to the cart
- When I remove "Sauce Labs Backpack" from the cart
- Then the cart badge should not be visible

### Scenario: Proceed to checkout

- Given I am logged in as a standard user
- And I have added "Sauce Labs Backpack" to the cart
- And I open the cart page
- When I proceed to checkout
- And I fill in checkout information with first name "John", last name "Doe", and postal code "12345"
- And I continue checkout
- And I finish the order
- Then I should see the order confirmation page

### Scenario: Validate cart contents

- Given I am logged in as a standard user
- When I add "Sauce Labs Backpack" to the cart
- And I add "Sauce Labs Bike Light" to the cart
- And I open the cart page
- Then I should see "Sauce Labs Backpack" in the cart
- And I should see "Sauce Labs Bike Light" in the cart

---

## Negative Scenarios

### Scenario: Invalid login attempt

- Given I am on the login page
- When I log in with invalid credentials
- Then I should see a login error message

### Scenario: Checkout with missing required information

- Given I am logged in as a standard user
- And I have added "Sauce Labs Backpack" to the cart
- And I open the cart page
- When I proceed to checkout
- And I continue checkout without filling required fields
- Then I should see a checkout error message "Error: First Name is required"

### Scenario: Locked-out user cannot login

- Given I am on the login page
- When I log in as a locked-out user
- Then I should see a login error message "Epic sadface: Sorry, this user has been locked out."

---

## Edge Cases

### Scenario: Empty cart behavior

- Given I am logged in as a standard user
- When I open the cart page
- Then the cart should be empty

### Scenario: Multiple item handling

- Given I am logged in as a standard user
- When I add "Sauce Labs Backpack" to the cart
- And I add "Sauce Labs Bike Light" to the cart
- Then the cart badge should show "2" items

### Scenario: Session behavior after page refresh

- Given I am logged in as a standard user
- When I add "Sauce Labs Backpack" to the cart
- And I refresh the page
- Then the cart badge should show "1" item

---

## API Scenarios (FakeStore)

### Scenario: Retrieve product list

- Given the FakeStore API is available
- When I request all products
- Then the response status should be 200
- And the response should contain a non-empty product list

### Scenario: Retrieve non-existent product

- Given the FakeStore API is available
- When I request product with id 99999
- Then the response should indicate the product was not found
