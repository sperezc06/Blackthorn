import { Locator, Page } from '@playwright/test';
import {
  clickWithHighlight,
  expectVisibleWithHighlight,
  fillWithHighlight,
  highlightStep,
} from '../utils/visualDebug';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path = '/'): Promise<void> {
    await highlightStep(this.page, `Navigate → ${path || '/'}`);
    await this.page.goto(path);
  }

  async reload(): Promise<void> {
    await highlightStep(this.page, 'Refresh page');
    await this.page.reload();
  }

  protected async clickHighlight(locator: Locator, label: string): Promise<void> {
    await clickWithHighlight(this.page, locator, label);
  }

  protected async fillHighlight(locator: Locator, value: string, label: string): Promise<void> {
    await fillWithHighlight(this.page, locator, value, label);
  }

  protected async expectVisibleHighlight(locator: Locator, label: string): Promise<void> {
    await expectVisibleWithHighlight(this.page, locator, label);
  }

  protected async stepHighlight(label: string): Promise<void> {
    await highlightStep(this.page, label);
  }
}
