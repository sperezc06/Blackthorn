import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['steps/**/*.ts'],
});

const visualDebug = ['1', 'true'].includes((process.env.VISUAL_DEBUG ?? '').toLowerCase());
const slowMo = process.env.SLOW_MO
  ? Number(process.env.SLOW_MO)
  : visualDebug
    ? 750
    : undefined;
const isCI = !!process.env.CI;
const isDemoMode = !!slowMo || visualDebug;
const demoTestTimeout = Number(process.env.DEMO_TEST_TIMEOUT ?? '180000');

export default defineConfig({
  testDir,
  grepInvert: /@manual/,
  fullyParallel: !isDemoMode,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isDemoMode ? 1 : isCI ? 2 : undefined,
  timeout: isDemoMode ? demoTestTimeout : 30_000,
  expect: { timeout: isDemoMode ? 15_000 : 10_000 },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    [
      'monocart-reporter',
      {
        name: 'SauceDemo QA Challenge',
        outputFile: 'monocart-report/index.html',
        coverage: { entry: [], source: [] },
      },
    ],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        detail: true,
        suiteTitle: true,
        environmentInfo: {
          framework: 'Playwright + playwright-bdd',
          application: 'SauceDemo',
          api: 'FakeStore',
          node_version: process.version,
        },
      },
    ],
  ],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: isDemoMode ? 'on' : 'retain-on-failure',
    actionTimeout: 10_000,
    ...(slowMo ? { launchOptions: { slowMo } } : {}),
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      grepInvert: /@api|@manual/,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      grepInvert: /@api|@manual/,
    },
  ],
});
