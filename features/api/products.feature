Feature: FakeStore Products API
  As a QA engineer
  I want to validate the FakeStore e-commerce API
  So that product data endpoints behave as expected

  @api
  Scenario: Retrieve all products
    Given the FakeStore API is available
    When I request all products
    Then the response status should be 200
    And the response should contain a non-empty product list
    And each product should have id, title, and price fields

  @api
  Scenario: Retrieve a non-existent product
    Given the FakeStore API is available
    When I request product with id 99999
    Then the response should indicate the product was not found
