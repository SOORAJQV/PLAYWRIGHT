import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {

  test.setTimeout(60000);

  await page.context().tracing.start({ screenshots: true, snapshots: true });

  await page.goto('https://auth-q-sit-pf.qvantel.systems/auth/realms/qvantel/protocol/openid-connect/auth?ui_locales=en&scope=openid&response_type=code&redirect_uri=https%3A%2F%2Fsct-q-sit-pf.qvantel.systems%3A443%2Foauth2%2Fcallback&state=92082ea1-844c-4f72-8f7c-06a56aa28366%7C%2F&client_id=sales-and-care-toolbox');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'screenshots/step1.png' });

  await page.getByRole('textbox', { name: 'Username or email' }).click();
  await page.getByRole('textbox', { name: 'Username or email' }).fill('tom');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'screenshots/step2.png' });

  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('omission_bottom_tom');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'screenshots/step3.png' });

  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'screenshots/step4.png' });

  await page.getByRole('link', { name: 'Return to the start page' }).click();
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'screenshots/step5.png' });

  await page.getByRole('textbox', { name: 'Type Customer name' }).click();
  await page.getByRole('textbox', { name: 'Type Customer name' }).fill('post onbrd');
  await page.getByRole('textbox', { name: 'Type Customer name' }).press('Enter');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'screenshots/step6.png' });

  await page.locator('button[name="submit-search"]').click();
  await page.waitForSelector('text=Suspended', { timeout: 10000 });
  const isSuspendedVisible = await page.isVisible('text=Suspended');
  expect(isSuspendedVisible).toBeTruthy();
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'screenshots/step7.png' });

  await page.getByRole('link', { name: ' Products' }).click();
  await page.waitForSelector('text=Qvantel Postpaid Mini', { timeout: 10000 });
  const productElement = await page.locator('span', { hasText: 'Qvantel Postpaid Mini' }).first();
  await productElement.click();
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'screenshots/step8.png' });

  const isTextVisible = await page.isVisible('text=Qvantel Postpaid Mini');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'screenshots/step9.png' });

  await page.context().tracing.stop({ path: 'trace.zip' });
});