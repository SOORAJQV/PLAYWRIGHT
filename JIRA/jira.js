require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const JiraClient = require('jira-client');
const FormData = require('form-data');

// Validate env vars
if (!process.env.JIRA_EMAIL || !process.env.JIRA_TOKEN) {
  throw new Error('❌ JIRA_EMAIL and JIRA_TOKEN must be set in a .env file or environment variables');
}

// Configure Jira client
const jira = new JiraClient({
  protocol: 'https',
  host: 'qvantel-sandbox.atlassian.net',
  username: process.env.JIRA_EMAIL,
  password: process.env.JIRA_TOKEN,
  apiVersion: '3',
  strictSSL: true,
});

// Fetch metadata
async function fetchCreateMeta(projectKey, issueType) {
  const url = `https://qvantel-sandbox.atlassian.net/rest/api/3/issue/createmeta` +
    `?projectKeys=${projectKey}&issuetypeNames=${issueType}&expand=projects.issuetypes.fields`;

  const auth = {
    username: process.env.JIRA_EMAIL,
    password: process.env.JIRA_TOKEN,
  };

  const response = await axios.get(url, {
    auth,
    headers: { Accept: 'application/json' }
  });

  return response.data;
}

// Upload screenshot to issue
async function attachScreenshot(issueKey, screenshotPath) {
  const form = new FormData();
  form.append('file', fs.createReadStream(screenshotPath));

  const headers = {
    ...form.getHeaders(),
    Authorization: `Basic ${Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_TOKEN}`).toString('base64')}`,
    'X-Atlassian-Token': 'no-check'
  };

  const url = `https://qvantel-sandbox.atlassian.net/rest/api/3/issue/${issueKey}/attachments`;

  try {
    await axios.post(url, form, { headers });
    console.log(`📎 Screenshot "${path.basename(screenshotPath)}" attached to ${issueKey}`);
  } catch (err) {
    console.error('❌ Error uploading screenshot:', err.message);
  }
}

// Create an issue
async function createIssue(summary, rawLogs, screenshotPath = null) {
  try {
    const meta = await fetchCreateMeta('XSP', 'Bug');
    const fieldsMeta = meta.projects[0].issuetypes[0].fields;

    // Clean logs (remove terminal escape sequences)
    const cleanedLogs = rawLogs
      .replace(/\x1B\[.*?m/g, '')  // Remove ANSI color codes
      .replace(/\x1B\[\d+A/g, '')  // Remove cursor up
      .replace(/\x1B\[\d+K/g, '')  // Remove erase line
      .trim();

    const descriptionADF = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: `❌ Automated test failed: ${summary}` }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '🧪 Steps to reproduce (log output):' }]
        },
        {
          type: 'codeBlock',
          attrs: { language: 'text' },
          content: [{ type: 'text', text: cleanedLogs || 'No logs available.' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '📎 See attached screenshot if available.' }]
        }
      ]
    };

    const payload = {
      fields: {
        project: { key: 'XSP' },
        summary,
        issuetype: { name: 'Bug' },
        description: descriptionADF
      }
    };

    if (fieldsMeta.priority) {
      const high = fieldsMeta.priority.allowedValues.find(v => v.name === 'High');
      if (high) payload.fields.priority = { id: high.id };
    }

    const issue = await jira.addNewIssue(payload);
    const issueKey = issue.key;
    console.log(`✅ Created issue: ${issueKey}`);
    console.log(`🔗 https://qvantel-sandbox.atlassian.net/browse/${issueKey}`);

    if (screenshotPath) {
      await attachScreenshot(issueKey, screenshotPath);
    }

  } catch (err) {
    if (err.response) {
      console.error('❌ Error creating issue:', {
        status: err.response.status,
        data: err.response.data
      });
    } else {
      console.error('❌ Error:', err.message);
    }
  }
}

// Run standalone
if (require.main === module) {
  const logFilePath = './logs.txt';
  const screenshotPath = './screenshots/login_failure.png';
  const summary = 'POSTPAID_ONBOARDING_VIA_SCT @regression';

  let logContent = '⚠️ Logs not available.';
  if (fs.existsSync(logFilePath)) {
    logContent = fs.readFileSync(logFilePath, 'utf-8');
  }

  createIssue(summary, logContent, screenshotPath);
}

module.exports = { createIssue };
