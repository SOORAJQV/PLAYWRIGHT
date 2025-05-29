import { expect } from '@playwright/test';
import { test } from '../jira-fixture';

require('dotenv').config();

test('test', async ({ page, context }) => {
  test.setTimeout(420000); 

   await page.goto('https://auth-q-sit-pf.qvantel.systems/auth/realms/qvantel/protocol/openid-connect/auth?ui_locales=en&scope=openid&response_type=code&redirect_uri=https%3A%2F%2Fsct-q-sit-pf.qvantel.systems%3A443%2Foauth2%2Fcallback&state=4616c54f-5586-48ae-b378-1183ce86fdf6%7C%2F&client_id=sales-and-care-toolbox');
   await page.getByRole('textbox', { name: 'Username or email' }).click();
   await page.getByRole('textbox', { name: 'Username or email' }).fill('tom');
   await page.getByRole('textbox', { name: 'Password' }).click();
   await page.getByRole('textbox', { name: 'Password' }).fill('omission_bottom_tom');
   await page.getByRole('button', { name: 'Sign In' }).click();
   await page.getByRole('link', { name: 'Return to the start page' }).click();
   await page.getByRole('link', { name: ' Shop' }).click();
   await page.getByRole('link', { name: 'Mobile Postpaid' }).click();
  

});