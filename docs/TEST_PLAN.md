# Test Plan — SauceDemo E-Commerce Platform

**Application Under Test:** https://www.saucedemo.com  
**Author:** Sebastian Perez Correa  

---

## 1. Scope and Objectives

### Features to be tested

- **Login** — authentication with valid, invalid, and locked-out users
- **Product listing** — inventory page visible after successful login
- **Shopping cart** — add items, remove items, validate badge and cart contents
- **Checkout** — customer information form, order completion, field validation
- **API** — product data validation via FakeStore (SauceDemo has no public REST API)

### Out of scope

- Performance and load testing
- Mobile native applications
- Real payment processing
- Accessibility and visual regression testing
- Product sorting and filtering
- SauceDemo backend API (not exposed)

### Objectives

Confirm that core e-commerce flows on SauceDemo work as expected across supported browsers. 

---

## 2. Test Approach

### Functional testing strategy

- **Positive:** Login → view products → add/remove cart items → validate cart → checkout → order confirmation
- **Negative:** Invalid login, locked-out user, checkout without required fields
- **Edge cases:** Empty cart, multiple items in cart, cart state after page refresh

Detailed Gherkin scenarios are documented separately in [`TEST_SCENARIOS.md`](TEST_SCENARIOS.md).

### UI validation approach

- Manual and automated functional testing through the browser UI
- **Playwright** with **Page Object Model** for maintainable selectors and assertions
- **Gherkin BDD** (`playwright-bdd`) for readable, business-facing test cases
- Web-first assertions: page URL, visible elements, error messages, cart badge count

### Integration considerations

- UI tests run against the live SauceDemo environment (no mocks)
- Each test starts with a clean browser session
- Cart and login state are not shared between scenarios
- Cross-browser execution on Chromium, Firefox, and WebKit

### API validation

SauceDemo is a front-end-only demo with no public REST API. API testing uses **FakeStore** (`https://fakestoreapi.com`) with Playwright's `request` fixture, as permitted by the challenge.

**Approach:** HTTP calls via `FakeStoreClient` (API wrapper); responses stored in test context and validated with status, body, and schema checks.

**Scenarios covered:**

| Test | Endpoint | Validations |
|------|----------|-------------|
| Product list (positive) | `GET /products` | HTTP 200; non-empty array; each product has `id`, `title`, `price` with correct types |
| Invalid product (negative) | `GET /products/99999` | Empty response body for non-existent ID (FakeStore returns HTTP 200) |
| API availability (pre-check) | `GET /products` | Service reachable before running dependent scenarios |

**Key checks:** response status codes, JSON body structure, required e-commerce fields, and error/empty behavior for invalid IDs.

---

## 3. Risk Assessment

| Risk | Mitigation |
|------|------------|
| SauceDemo site unavailable | Document external dependency; enable CI retries |
| Cross-browser inconsistencies | Use Playwright auto-waiting and web-first assertions |
| FakeStore API downtime | Health-check in first API scenario; reasonable timeouts |
| Demo product names change | Centralize test data in `config/test-data.ts` |
| Flaky tests from timing issues | Avoid hard waits; rely on Playwright built-in waiting |

---

## 4. Entry and Exit Criteria

### Entry criteria (when testing can begin)

- Node.js 18+ installed
- Dependencies installed (`npm install`)
- Playwright browsers installed (`npx playwright install`)
- Network access to saucedemo.com and fakestoreapi.com
- Test plan and Gherkin scenarios reviewed

### Exit criteria (when testing is complete)

- All automated scenarios pass (UI on 3 browsers + API)
- No open P1 defects in scope
- Test results documented via HTML report
- Known limitations and assumptions documented in README

---

## 5. Environment Requirements

### Browser support

| Browser | Usage |
|---------|-------|
| Chromium | UI and API tests |
| Firefox | UI tests |
| WebKit | UI tests |

### Test data considerations

| Data | Value |
|------|-------|
| Valid user | `standard_user` / `secret_sauce` |
| Invalid user | `invalid_user` / `wrong_password` |
| Locked-out user | `locked_out_user` / `secret_sauce` |
| Test products | Sauce Labs Backpack, Sauce Labs Bike Light |
| Checkout info | John Doe, postal code 12345 |

### Tooling assumptions

| Tool | Purpose |
|------|---------|
| Playwright + TypeScript | Test automation framework |
| playwright-bdd | Gherkin to Playwright test generation |
| Page Object Model | UI abstraction layer |
| Monocart / Playwright HTML | Test reporting |
| GitHub Actions | Example CI workflow (optional, not active locally) |
