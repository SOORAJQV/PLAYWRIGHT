import { expect } from '@playwright/test';
import { test } from '../JIRA/jira-fixture';

test('SCT_LOGIN', async ({ page }) => {

  test.setTimeout(60000);

  await page.context().tracing.start({ screenshots: true, snapshots: true });

  await page.goto('https://sct-q-sit-pf.qvantel.systems/');
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


  await page.getByRole('textbox', { name: 'Type Customer name' }).click();
  await page.getByRole('textbox', { name: 'Type Customer name' }).fill('post onbrd');
  await page.getByRole('textbox', { name: 'Type Customer name' }).press('Enter');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'screenshots/step6.png' });

  await page.locator('button[name="submit-search"]').click();
  await page.waitForSelector('text=Suspended', { timeout: 10000 });
  const isSuspendedVisible = await page.isVisible('text=Suspened');
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