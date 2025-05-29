import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    browserName: 'chromium', // All tests use Chromium
  },
  projects: [
    {
      name: 'smoke',
      grep: /@smoke/,
      testDir: './tests',
    },
    {
      name: 'regression',
      grep: /@regression/,
      testDir: './tests',
    },
  ],
});
