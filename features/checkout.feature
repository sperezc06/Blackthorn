Feature: Checkout
  As a SauceDemo shopper
  I want to complete my purchase
  So that I can receive my order confirmation

  Background:
    Given I am logged in as a standard user
    And I have added "Sauce Labs Backpack" to the cart
    And I open the cart page

  @ui @smoke
  Scenario: Proceed to checkout
    When I proceed to checkout
    And I fill in checkout information with first name "John", last name "Doe", and postal code "12345"
    And I continue checkout
    And I finish the order
    Then I should see the order confirmation page

  @ui @negative
  Scenario: Checkout with missing required information
    When I proceed to checkout
    And I continue checkout without filling required fields
    Then I should see a checkout error message "Error: First Name is required"
