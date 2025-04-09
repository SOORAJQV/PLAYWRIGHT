import { test, expect } from '@playwright/test';

const generateUniqueValue = (prefix = '') => `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;

test('test', async ({ page, context }) => {
  test.setTimeout(420000); // Set timeout to 7 minutes 

  
  await context.tracing.start({ screenshots: true, snapshots: true });

  console.log('Navigating to the login page...');
  await page.goto('https://auth-q-sit-pf.qvantel.systems/auth/realms/qvantel/protocol/openid-connect/auth?ui_locales=en&scope=openid&response_type=code&redirect_uri=https%3A%2F%2Fsct-q-sit-pf.qvantel.systems%3A443%2Foauth2%2Fcallback&state=a43b005c-2253-4930-9670-c4e076d51186%7C%2F&client_id=sales-and-care-toolbox');
  console.log('Login page loaded successfully.');

  console.log('Filling in username and password...');
  await page.getByRole('textbox', { name: 'Username or email' }).fill('tom');
  await page.getByRole('textbox', { name: 'Password' }).fill('omission_bottom_tom');
  console.log('Verified Username and password fields are enabled.');

  console.log('Clicking on Sign In button...');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('button', { name: 'Logged in Tom Tamer ' });
  console.log('Login to Tom user is successful.');

  console.log('Navigating to the shop tab...');
  await page.getByRole('link', { name: 'Return to the start page' }).click();
  await page.getByRole('link', { name: ' Shop' }).click();
  await page.getByRole('link', { name: 'Mobile Postpaid' }).click();
  console.log('Navigated to shop tab and opened Mobile postpaid section from Plans.');

  console.log('Performing risk assessment...');
  await page.getByRole('button', { name: 'Perform risk assessment' }).click();
  console.log('Clicked on Perform Risk Assessment button and the window is opened successfully.');

  console.log('Filling in identification details...');
  await page.getByLabel('Identification type').selectOption('personal-identity-code');
  const uniqueIdentificationCode = generateUniqueValue('ID-');
  console.log(`Generated Identification Code: ${uniqueIdentificationCode}`);
  await page.getByRole('textbox', { name: 'Identification code *' }).fill(uniqueIdentificationCode);
  await page.getByLabel('Issuing country').selectOption('FI');
  const uniqueIssuingAuthority = generateUniqueValue('Auth-');
  console.log(`Generated Issuing Authority: ${uniqueIssuingAuthority}`);
  await page.getByRole('textbox', { name: 'Issuing authority *' }).fill(uniqueIssuingAuthority);
  console.log('Identification details are filled successfully.');

  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByLabel('Account type').selectOption('natural-person');
  console.log('No previously stored customer found is displayed and window for entering customer details opened successfully.');

  const uniqueGivenName = generateUniqueValue('GN-');
  await page.getByRole('textbox', { name: 'Given Name *' }).fill(uniqueGivenName);
  await page.getByRole('textbox', { name: 'FamilyName *' }).fill(uniqueGivenName);
  await page.getByLabel('Country', { exact: true }).selectOption('FI');
  await page.getByRole('textbox', { name: 'City *' }).fill(generateUniqueValue('City-'));
  await page.getByRole('textbox', { name: 'Street *' }).fill(generateUniqueValue('Street-'));
  await page.getByRole('textbox', { name: 'Postal code *' }).fill(generateUniqueValue().slice(-6));
  await page.getByRole('textbox', { name: 'john@doe.com' }).fill(`user${Date.now()}@test.com`);
  await page.getByRole('textbox', { name: 'Phone Number' }).fill(`9${Math.floor(100000000 + Math.random() * 900000000)}`);
  await page.getByRole('button', { name: 'Continue' }).click();
  console.log('Customer details are entered successfully and clicked on continue button.');

  await page.getByRole('row', { name: 'Qvantel Super 5G  Postpaid' }).locator('sct-table-actions-common').getByRole('link').click();
  await page.getByRole('button', { name: 'Select', exact: true }).click();
  await page.locator('sct-flowable').filter({ hasText: 'Geo Localization consent' }).getByRole('button').click();
  await page.locator('sct-flowable').filter({ hasText: 'StockPriceQRP-automation-' }).getByRole('button').click();
  console.log('Successfully selected the Plan Qvantel Super 5G Postpaid and clicked on continue button.');

  const radioButton = page.locator('//html/body/ui-view/sct-app/div/div/main/section/ui-view/sct-shop-widget/div/sct-flex-wizard/div/div[1]/div[1]/span[1]/sct-flex-wizard-component-renderer/div[2]/sct-flowable/div[1]/sct-form/form/sct-form-dd-radio-input/div/div/div[1]/input');
  await radioButton.waitFor({ state: 'visible' });
  const radioButtonId = await radioButton.getAttribute('id');
  const radioButtonLabel = page.locator(`label[for="${radioButtonId}"]`);
  await radioButtonLabel.click();
  await page.getByRole('button', { name: 'Continue' }).first().click();
  console.log('Selected the msisdn and clicked on continue button.');

  await page.locator('.custom-control').first().click();
  console.log("Working as expected.");
  await page.getByRole('button', { name: 'Confirm' }).click();
  console.log('All the forms have been successfully filled!');

  await page.getByRole('button', { name: 'Continue' }).nth(1).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Approve' }).click();
  console.log('Products offerings and basket details page is loaded successfully and clicked on Approve button.');

  await page.getByRole('button', { name: 'Go to checkout' }).click();
  await page.getByLabel('Select payment method').selectOption('invoice');
  await page.getByRole('button', { name: 'Submit' }).click();
  console.log('Payment method is selected as Invoice and clicked on submit button.');

  await page.getByRole('textbox', { name: 'Type Customer name' }).fill(uniqueGivenName);
  await page.locator('button[name="submit-search"]').click();
  console.log('The customer created is searched and the customer is opened successfully.');

  console.log('Waiting for 3 mins for status change from Pending to Active...');
  await new Promise(resolve => setTimeout(resolve, 240000));
  await page.reload();

  console.log('Waiting for the "Active" status to appear...');
  await page.reload();
  await page.locator('sct-key-value div').nth(3).click();
  console.log('"Active" status is now visible.');

  console.log('Verifying the Active status in the product page...');
  await page.getByRole('link', { name: ' Products' }).click();
  await page.locator('sct-key-value div').filter({ hasText: 'Active' }).nth(3).click();
  console.log('Verified the Active status in the product page.');

  console.log('Verifying the order details...');
  await page.getByRole('link', { name: ' Orders' }).click();
  await page.reload();
  await page.getByRole('link', { name: '' }).click();
  console.log('Clicked on the order link and opened the order details page successfully.');

  await page.locator('#orderDetailsOrderStatus').getByText('Completed');
  console.log('Verified the Subscription name and the order status is completed.');

  
  await context.tracing.stop({ path: 'trace.zip' });
  console.log('Trace saved to trace.zip');
});