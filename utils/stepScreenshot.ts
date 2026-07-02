import { Page, TestInfo } from '@playwright/test';

/** Attach a viewport screenshot to the test report (Monocart / Playwright). */
export async function attachStepScreenshot(
  page: Page,
  testInfo: TestInfo,
  stepIndex: number,
  stepTitle: string,
): Promise<void> {
  if (page.isClosed()) return;

  const screenshot = await page.screenshot();
  const label = `Step ${stepIndex + 1}: ${stepTitle}`;

  await testInfo.attach(label, {
    body: screenshot,
    contentType: 'image/png',
  });
}
