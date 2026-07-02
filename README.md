# SauceDemo QA Challenge — E-Commerce Platform Testing

Automated test suite for the **Senior QA Engineer Challenge**, covering SauceDemo UI flows and FakeStore API validation using Playwright, TypeScript, Page Object Model, Gherkin BDD, and Monocart reporting.

## Deliverables (PDF compliance)

| Requirement | Status | Location |
|-------------|--------|----------|
| Test Plan (Task 1) | Done | [`docs/TEST_PLAN.md`](docs/TEST_PLAN.md) |
| Gherkin scenarios (Task 2, ≥5) | Done (13) | [`docs/TEST_SCENARIOS.md`](docs/TEST_SCENARIOS.md) + [`features/`](features/) |
| Playwright + TypeScript + POM | Done | [`pages/`](pages/), [`steps/`](steps/) |
| 2–3+ UI automated tests | Done (10) | `@ui` tags |
| Cross-browser (Chromium, Firefox, WebKit) | Done | `playwright.config.ts` |
| API test with `request` fixture | Done (2) | `@api` tags |
| README with setup/run/assumptions | Done | this file |

## Tech Stack

- **Playwright** + **TypeScript**
- **playwright-bdd** — Gherkin → native Playwright tests
- **Page Object Model** — UI abstraction in `pages/`
- **Monocart Report** — HTML report with screenshots, videos, steps, and pass/fail summary
- **FakeStore API** — e-commerce API via Playwright `request` fixture
- **Cross-browser** — Chromium, Firefox, WebKit

## Prerequisites

- Node.js 18+
- Network access to [saucedemo.com](https://www.saucedemo.com) and [fakestoreapi.com](https://fakestoreapi.com)

## Setup

```bash
npm install
npx playwright install chromium firefox webkit
```

## Running Tests

| Command | What it does |
|---------|--------------|
| **`npm run test:demo`** | **Recommended for demos** — **Chromium only**, headed, slowed down, red highlights + test name. Does **not** run Firefox/WebKit (use `npm test` for cross-browser). |
| `npm test` | Full suite — all UI scenarios × **3 browsers** (Chromium, Firefox, WebKit) + API tests. Headless. Use for CI and final validation. |
| `npm run test:ui` | UI tests only — headless, **Chromium + Firefox + WebKit** (33 runs). |
| `npm run test:api` | API tests only — FakeStore endpoints, Chromium. |
| `npm run report` | Opens the Monocart HTML report from the last test run. |

```bash
npm run test:demo     # demo mode — browser visible, highlights, test name in red
npm test              # run everything (headless, CI-style)
npm run report        # view results
```

### Demo mode (`test:demo`)

**Use `npm run test:demo` when presenting or debugging** — one visible Chromium window, one test at a time:

1. **Chromium only** — so you watch a single browser during a demo. Cross-browser (Firefox + WebKit) runs with `npm test` or `npm run test:ui`.
2. **Slows down actions** so each click/fill is easy to follow (`slowMo`, default **750 ms** — configurable, see below).
3. Shows the **current test name in red** at the top (e.g. `▶ Successful login`).
4. Highlights in red the button or field being used.
5. Shows a step label below the test name (e.g. `Login → Submit`).
6. Keeps a small log on the right with steps already executed.

For fast/CI runs use `npm test` instead — no highlights, runs headless, all browsers.

**Why a test can “timeout” in demo mode:** each highlighted step adds `SLOW_MO` + `VISUAL_PAUSE_MS` on top of normal Playwright time. Long flows (e.g. checkout with login background) need more than the default 30 s, so demo mode uses a **3 minute** test timeout automatically. If you crank up the slowness a lot, raise it with `DEMO_TEST_TIMEOUT=300000` (ms).

**Slowing down the demo (optional env vars):**

| Variable | Default in `test:demo` | What it controls |
|----------|------------------------|------------------|
| `SLOW_MO` | `750` | Delay between Playwright actions (ms). Higher = slower browser. |
| `VISUAL_PAUSE_MS` | `600` | Extra pause after each highlighted step (ms). |
| `DEMO_TEST_TIMEOUT` | `180000` | Max time per test in demo mode (ms). Only applies when `VISUAL_DEBUG=1`. |

Example — slower demo:

```bash
SLOW_MO=1200 VISUAL_PAUSE_MS=900 npm run test:demo
```

**Visual overlays** — [`utils/visualDebug.ts`](utils/visualDebug.ts) injects the red badges, outlines, and step log in the browser. It only runs when `VISUAL_DEBUG=1` (set automatically by `test:demo`); in `npm test` / CI it is inactive and adds no overhead.

## Report

After any test run (`npm test`, `npm run test:ui`, etc.), open the **Monocart** report — it is the one to use for reviewing results:

```bash
npm run report
```

Monocart shows a clear dashboard: which tests passed or failed, **screenshots after each Gherkin step**, videos on failures, and breakdown by browser. No extra setup — it generates automatically on every run into `monocart-report/`.

## CI pipeline (example — not active by default)

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) is an **example** of how you would run tests automatically in a real team setup. It is **not deployment** — it does not publish the app anywhere.

**What it would do** if this repo were pushed to GitHub and Actions were enabled:

1. Trigger on push/PR to `main` or `master`
2. Install dependencies and Playwright browsers
3. Run `npm test`
4. Upload the Monocart report as a CI artifact

**Today:** tests run locally with `npm test`. The workflow is included to show CI-ready structure for a production QA process, but nothing runs until the project lives on GitHub with Actions turned on.

## Project Structure

### Source code (you edit these)

| Path | Purpose |
|------|---------|
| [`features/`](features/) | Gherkin scenarios (`.feature` files) — Task 2 deliverable |
| [`steps/`](steps/) | Step definitions that connect Gherkin to Playwright |
| [`pages/`](pages/) | Page Object Model — selectors and UI actions |
| [`helpers/`](helpers/) | API client (`FakeStoreClient`) |
| [`utils/`](utils/) | Report screenshots per step ([`stepScreenshot.ts`](utils/stepScreenshot.ts)) + demo overlays ([`visualDebug.ts`](utils/visualDebug.ts)) |
| [`config/`](config/) | Shared test data (users, products, messages) |
| [`docs/`](docs/) | Test plan and Gherkin scenario docs |
| [`playwright.config.ts`](playwright.config.ts) | Browsers, reporters, timeouts |
| [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | Example CI (not deployment) |

### Auto-generated — ignore these

Created when you run tests. **Do not edit.** In [`.gitignore`](.gitignore) — not part of the repo.

| Path | Note |
|------|------|
| `.features-gen/` | Internal output from `bddgen` — edit `features/` instead |
| `test-results/` | Failure artifacts |
| `monocart-report/` | Report output — open with `npm run report` |
| `node_modules/` | Dependencies |

## Automated Scenarios (10 UI + 2 API)

| Tag | Scenario | PDF category |
|-----|----------|--------------|
| `@ui @smoke` | Successful login | Positive |
| `@ui @negative` | Failed login | Negative |
| `@ui @negative` | Locked-out user | Negative |
| `@ui @smoke` | Add to cart | Positive |
| `@ui @smoke` | Remove from cart | Positive |
| `@ui @negative` | Empty cart | Edge |
| `@ui` | Multiple items in cart | Edge |
| `@ui @edge` | Cart persists after refresh | Session/Edge |
| `@ui @smoke` | Complete checkout | Positive |
| `@ui @negative` | Checkout missing fields | Negative |
| `@api` | GET all products | API |
| `@api` | GET non-existent product | API |

## Assumptions

1. **No SauceDemo API** — FakeStore used as permitted by the challenge.
2. **FakeStore 404 behavior** — Non-existent IDs return HTTP 200 with empty body.
3. **Empty cart** — Checkout button stays visible; we assert zero cart items.
4. **Screenshots** — Each UI step attaches a screenshot to the Monocart report (`Step 1: …`, `Step 2: …`, etc.).

## Credentials

| User | Password | Purpose |
|------|----------|---------|
| `standard_user` | `secret_sauce` | Happy-path flows |
| `locked_out_user` | `secret_sauce` | Negative login |
| `invalid_user` | `wrong_password` | Invalid credentials |
