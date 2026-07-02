Feature: Shopping Cart
  As a SauceDemo shopper
  I want to manage items in my cart
  So that I can purchase the products I need

  Background:
    Given I am logged in as a standard user

  @ui @smoke
  Scenario: Add item to cart
    When I add "Sauce Labs Backpack" to the cart
    Then the cart badge should show "1" item

  @ui @smoke
  Scenario: Remove item from cart
    Given I have added "Sauce Labs Backpack" to the cart
    When I remove "Sauce Labs Backpack" from the cart
    Then the cart badge should not be visible

  @ui @smoke
  Scenario: Validate cart contents
    When I add "Sauce Labs Backpack" to the cart
    And I add "Sauce Labs Bike Light" to the cart
    And I open the cart page
    Then I should see "Sauce Labs Backpack" in the cart
    And I should see "Sauce Labs Bike Light" in the cart

  @ui @edge
  Scenario: Multiple item handling
    When I add "Sauce Labs Backpack" to the cart
    And I add "Sauce Labs Bike Light" to the cart
    Then the cart badge should show "2" items

  @ui @edge
  Scenario: Empty cart behavior
    When I open the cart page
    Then the cart should be empty

  @ui @edge
  Scenario: Session behavior after page refresh
    When I add "Sauce Labs Backpack" to the cart
    And I refresh the page
    Then the cart badge should show "1" item
