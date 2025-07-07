import { defineConfig } from '@playwright/test';

export default defineConfig({
  workers: undefined, 
  use: {
    browserName: 'chromium', 
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
