import { Page, Locator } from '@playwright/test';

interface SelectorOption {
  role?: Parameters<Page['getByRole']>[0];
  name?: string;
  fallbackTextSelectors?: string[]; 
}

export class SelfHealingHelper {
  constructor(private page: Page) {}

  async findElement(option: SelectorOption, timeout = 5000): Promise<Locator> {
    const { role, name, fallbackTextSelectors } = option;

    if (role && name) {
      const label = `role=${role}, name=${name}`;
      console.log(`[SelfHealing] Trying getByRole(${label})`);
      try {
        const locator = this.page.getByRole(role, { name });
        await locator.waitFor({ timeout });
        console.log(`[SelfHealing] ✅ Found using getByRole(${label})`);
        return locator;
      } catch {
        console.warn(`[SelfHealing] ❌ Failed to find element using getByRole(${label})`);
      }
    }

    if (fallbackTextSelectors && fallbackTextSelectors.length > 0) {
      for (const selector of fallbackTextSelectors) {
        console.log(`[SelfHealing] Trying fallback selector: ${selector}`);
        try {
          const locator = this.page.locator(selector);
          await locator.waitFor({ timeout });
          console.log(`[SelfHealing] ✅ Found using fallback selector: ${selector}`);
          return locator;
        } catch {
          console.warn(`[SelfHealing] ❌ Failed with fallback selector: ${selector}`);
        }
      }
    }

    throw new Error(`[SelfHealing] ❌ Element not found using any selector strategy.`);
  }

  async click(option: SelectorOption): Promise<void> {
    const element = await this.findElement(option);
    console.log(`[SelfHealing] Clicking element`);
    await element.click();
  }

  async fill(option: SelectorOption, value: string): Promise<void> {
    const element = await this.findElement(option);
    console.log(`[SelfHealing] Filling element with value: ${value}`);
    await element.fill(value);
  }
}
