import { Locator, Page, expect } from '@playwright/test';

const TEST_BADGE_ID = 'pw-visual-debug-test';
const BADGE_ID = 'pw-visual-debug-badge';
const LOG_PANEL_ID = 'pw-visual-debug-log';

const testBadgeStyles = [
  'position:fixed',
  'top:12px',
  'left:50%',
  'transform:translateX(-50%)',
  'z-index:2147483647',
  'background:#c92a2a',
  'color:#fff',
  'padding:12px 22px',
  'border-radius:10px',
  'font:700 17px system-ui,-apple-system,sans-serif',
  'letter-spacing:.02em',
  'box-shadow:0 8px 24px rgba(201,42,42,.45)',
  'pointer-events:none',
  'white-space:nowrap',
  'max-width:90vw',
  'overflow:hidden',
  'text-overflow:ellipsis',
].join(';');

/** Enabled with VISUAL_DEBUG=1 — headed run with red highlights + step label. */
export function isVisualDebugMode(): boolean {
  const v = process.env.VISUAL_DEBUG ?? '';
  return v === '1' || v.toLowerCase() === 'true';
}

export function visualPauseMs(): number {
  if (!isVisualDebugMode()) return 0;
  const parsed = Number(process.env.VISUAL_PAUSE_MS ?? '600');
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 600;
}

async function appendToLogPanel(page: Page, text: string): Promise<void> {
  await page.evaluate(
    ({ panelId, line }) => {
      let panel = document.getElementById(panelId);
      if (!panel) {
        panel = document.createElement('div');
        panel.id = panelId;
        panel.style.cssText = [
          'position:fixed',
          'top:108px',
          'right:12px',
          'z-index:2147483646',
          'width:320px',
          'max-height:40vh',
          'overflow-y:auto',
          'background:rgba(20,20,20,.92)',
          'color:#f1f3f5',
          'padding:10px 12px',
          'border-radius:10px',
          'font:12px/1.4 ui-monospace,monospace',
          'box-shadow:0 6px 20px rgba(0,0,0,.35)',
          'pointer-events:none',
        ].join(';');
        document.body.appendChild(panel);
      }
      const entry = document.createElement('div');
      entry.textContent = `→ ${line}`;
      entry.style.marginBottom = '4px';
      panel.appendChild(entry);
      panel.scrollTop = panel.scrollHeight;
    },
    { panelId: LOG_PANEL_ID, line: text },
  );
}

/** Red banner with the current test name — shown at the start of each test in VISUAL_DEBUG mode. */
export async function showTestBanner(page: Page, title: string): Promise<void> {
  if (!isVisualDebugMode()) return;

  await page.evaluate(
    ({ testBadgeId, testBadgeStyles: styles, testTitle }) => {
      const inject = () => {
        let badge = document.getElementById(testBadgeId);
        if (!badge) {
          badge = document.createElement('div');
          badge.id = testBadgeId;
          badge.style.cssText = styles;
          document.body.appendChild(badge);
        }
        badge.textContent = `▶ ${testTitle}`;
      };
      if (document.body) inject();
      else document.addEventListener('DOMContentLoaded', inject);
    },
    { testBadgeId: TEST_BADGE_ID, testBadgeStyles, testTitle: title },
  );
}

/** Re-inject the test banner after every navigation so it survives page loads. */
export async function registerTestBanner(page: Page, title: string): Promise<void> {
  if (!isVisualDebugMode()) return;

  await page.addInitScript(
    ({ testBadgeId, testBadgeStyles: styles, testTitle }) => {
      const inject = () => {
        let badge = document.getElementById(testBadgeId);
        if (!badge) {
          badge = document.createElement('div');
          badge.id = testBadgeId;
          badge.style.cssText = styles;
          document.body.appendChild(badge);
        }
        badge.textContent = `▶ ${testTitle}`;
      };
      if (document.body) inject();
      else document.addEventListener('DOMContentLoaded', inject);
    },
    { testBadgeId: TEST_BADGE_ID, testBadgeStyles, testTitle: title },
  );

  await showTestBanner(page, title);
  console.log(`\x1b[31m\x1b[1m▶ TEST: ${title}\x1b[0m`);
}

async function showStepLabel(page: Page, label: string): Promise<void> {
  await page.evaluate(
    ({ id, text }) => {
      let badge = document.getElementById(id);
      if (!badge) {
        badge = document.createElement('div');
        badge.id = id;
        badge.style.cssText = [
          'position:fixed',
          'top:64px',
          'left:50%',
          'transform:translateX(-50%)',
          'z-index:2147483646',
          'background:#e03131',
          'color:#fff',
          'padding:10px 18px',
          'border-radius:10px',
          'font:600 15px system-ui,-apple-system,sans-serif',
          'box-shadow:0 6px 20px rgba(0,0,0,.35)',
          'pointer-events:none',
        ].join(';');
        document.body.appendChild(badge);
      }
      badge.textContent = text;
    },
    { id: BADGE_ID, text: label },
  );
  await appendToLogPanel(page, label);
}

/** Red outline + pause so you can see what the test is targeting. */
export async function highlightLocator(page: Page, locator: Locator, label: string): Promise<void> {
  if (!isVisualDebugMode()) return;

  await showStepLabel(page, label);
  await locator.scrollIntoViewIfNeeded().catch(() => {});
  await locator
    .evaluate((el) => {
      el.style.outline = '3px solid #e03131';
      el.style.outlineOffset = '4px';
      el.style.boxShadow = '0 0 0 6px rgba(224, 49, 49, 0.25)';
      el.style.backgroundColor = 'rgba(224, 49, 49, 0.12)';
    })
    .catch(() => {});

  await page.waitForTimeout(visualPauseMs());
}

export async function highlightStep(page: Page, label: string): Promise<void> {
  if (!isVisualDebugMode()) return;
  await showStepLabel(page, label);
  await page.waitForTimeout(visualPauseMs());
}

export async function clickWithHighlight(page: Page, locator: Locator, label: string): Promise<void> {
  await highlightLocator(page, locator, label);
  await locator.click();
}

export async function fillWithHighlight(
  page: Page,
  locator: Locator,
  value: string,
  label: string,
): Promise<void> {
  await highlightLocator(page, locator, label);
  await locator.fill(value);
}

export async function expectVisibleWithHighlight(
  page: Page,
  locator: Locator,
  label: string,
): Promise<void> {
  await highlightLocator(page, locator, label);
  await expect(locator).toBeVisible();
}
