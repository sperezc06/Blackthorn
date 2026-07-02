Feature: Login
  As a SauceDemo user
  I want to authenticate securely
  So that I can access the product catalog

  @ui @smoke
  Scenario: Successful login
    Given I am on the login page
    When I log in with valid credentials
    Then I should see the products page

  @ui @negative
  Scenario: Invalid login attempt
    Given I am on the login page
    When I log in with invalid credentials
    Then I should see a login error message

  @ui @negative
  Scenario: Locked-out user cannot login
    Given I am on the login page
    When I log in as a locked-out user
    Then I should see a login error message "Epic sadface: Sorry, this user has been locked out."
