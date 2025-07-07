import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });
/**
 * Allure reporter is already configured below in the reporter array.
 * If you want to add multiple reporters (e.g., 'list' and 'allure-playwright'),
 * update the reporter configuration as shown below.
 */

// Example: Add 'list' reporter along with 'allure-playwright'
const reporters = [
  ['list'],
  ['allure-playwright']
];
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // ✅ Allure reporter configuration
  reporter: [['allure-playwright']],

  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
