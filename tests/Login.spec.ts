import { expect } from '@playwright/test';
import { test } from '../jira-fixture';
import { SelfHealingHelper } from './selfHealingHelper';

require('dotenv').config();

test('Self-healing login and navigation @Regression', async ({ page, context }) => {
  test.setTimeout(420000);

  const helper = new SelfHealingHelper(page);

  await page.goto('https://sct-q-sit-pf.qvantel.systems/');
  await helper.fill({ role: 'textbox', name: 'Username or email' }, 'tom');
  await helper.fill({ role: 'textbox', name: 'Password' }, 'omission_bottom_tom');
  await helper.click({ role: 'button', name: 'Sign In' });
  await page.waitForTimeout(10000);
  await helper.click({ 
    role: 'link', 
    name: ' Shop', 
    fallbackTextSelectors: ['text=Shop'] // In case icon names change
  });
  await helper.click({ role: 'link', name: 'Mobile Postpaid' });

});