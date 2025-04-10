import axios from 'axios';
import * as fs from 'fs';
import FormData from 'form-data';
require('dotenv').config();

console.log('Environment Variables:', {
  JIRA_EMAIL: process.env.JIRA_EMAIL,
  JIRA_PROJECT_KEY: process.env.JIRA_PROJECT_KEY,
  JIRA_BASE_URL: process.env.JIRA_BASE_URL,
});

const auth = Buffer.from(
  `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
).toString('base64');

export async function createJiraIssue(summary: string, description: string, screenshotPath?: string) {
  console.log('🔍 Starting Jira issue creation...');
  console.log('Payload:', { summary, description, screenshotPath });

  const issuePayload = {
    fields: {
      project: { key: process.env.JIRA_PROJECT_KEY },
      summary,
      description,
      issuetype: { name: 'Bug' },
    },
  };

  try {
    const { data } = await axios.post(
      `${process.env.JIRA_BASE_URL}/rest/api/3/issue`,
      issuePayload,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    const issueKey = data.key;
    console.log(`✅ Created Jira issue: ${issueKey}`);

    if (screenshotPath) {
      await attachScreenshot(issueKey, screenshotPath);
    }

    return issueKey;
  } catch (error) {
    console.error('❌ Failed to create Jira issue:', error.response?.data || error.message || error);
  }
}

async function attachScreenshot(issueKey: string, screenshotPath: string) {
  const form = new FormData();
  form.append('file', fs.createReadStream(screenshotPath));

  try {
    await axios.post(
      `${process.env.JIRA_BASE_URL}/rest/api/3/issue/${issueKey}/attachments`,
      form,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          ...form.getHeaders(),
          'X-Atlassian-Token': 'no-check',
        },
      }
    );

    console.log(`📸 Screenshot attached to ${issueKey}`);
  } catch (error) {
    console.error('❌ Failed to upload screenshot:', error.response?.data || error.message);
  }
}