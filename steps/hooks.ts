import { createBdd } from 'playwright-bdd';
import { attachStepScreenshot } from '../utils/stepScreenshot';
import { registerTestBanner } from '../utils/visualDebug';
import { test } from './fixtures';

const { AfterStep, Before } = createBdd(test);

Before({ tags: '@ui' }, async ({ page, $testInfo }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await registerTestBanner(page, $testInfo.title);
});

AfterStep({ tags: '@ui' }, async ({ page, $testInfo, $step, $bddContext }) => {
  await attachStepScreenshot(page, $testInfo, $bddContext.stepIndex, $step.title);
});
