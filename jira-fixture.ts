import { test as base } from '@playwright/test';
const { createIssue } = require('./jira'); // Ensure this matches your file structure

export const test = base.extend({
  // Auto-create a JIRA issue on failure
  async page({ page }, use, testInfo) {
    await use(page);
    if (testInfo.status !== testInfo.expectedStatus) {
      await createIssue(testInfo.title, `Failure in test: ${testInfo.title}\n\n${testInfo.error?.message}`);
    }
  },
});
