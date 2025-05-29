import { expect } from '@playwright/test';
import { test } from '../jira-fixture';
import { SelfHealingHelper } from './selfHealingHelper';

require('dotenv').config();

test('Self-healing login and navigation', async ({ page, context }) => {
  test.setTimeout(420000);

  const helper = new SelfHealingHelper(page);

  await page.goto('https://auth-q-sit-pf.qvantel.systems/auth/realms/qvantel/protocol/openid-connect/auth?ui_locales=en&scope=openid&response_type=code&redirect_uri=https%3A%2F%2Fsct-q-sit-pf.qvantel.systems%3A443%2Foauth2%2Fcallback&state=4616c54f-5586-48ae-b378-1183ce86fdf6%7C%2F&client_id=sales-and-care-toolbox');

  await helper.fill({ role: 'textbox', name: 'Username or email' }, 'tom');
  await helper.fill({ role: 'textbox', name: 'Password' }, 'omission_bottom_tom');
  await helper.click({ role: 'button', name: 'Sign In' });
  await helper.click({ role: 'link', name: 'Return to the start page' });
  await page.waitForTimeout(10000);
  await helper.click({ 
    role: 'link', 
    name: ' Shop', 
    fallbackTextSelectors: ['text=Shop'] // In case icon names change
  });
  await helper.click({ role: 'link', name: 'Mobile Postpaid' });

});