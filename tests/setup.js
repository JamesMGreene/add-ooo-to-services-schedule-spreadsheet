// Node.js core modules
const path = require('path')

Object.assign(process.env, {
  //
  // GitHub Actions generic env vars
  //
  GITHUB_REPOSITORY: 'JamesMGreene/faux-services-actions-test',
  GITHUB_ACTION: 'add-ooo-to-spreadsheet',
  GITHUB_EVENT_NAME: 'issue_comment',
  GITHUB_EVENT_PATH: path.join(
    __dirname,
    'fixtures',
    'github',
    'issue_comment.created',
    'event',
    'success',
    'range-for-two-dates.json'
  ),
  GITHUB_WORKSPACE: path.join(__dirname, 'fixtures', 'workspace'),

  //
  // Env vars more specific to this particular Action
  //
  GITHUB_TOKEN: 'deadbeef',
  GOOGLE_API_CLIENT_EMAIL: 'svc-acct-name@project-id-123.iam.gserviceaccount.com',
  GOOGLE_API_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\nMEH\n-----END PRIVATE KEY-----\n',
  SPREADSHEET_ID: 'blah-foo-baz',
  SHEET_NAME: '2019-neworg',
  DATE_ROW: '1',
  LOGIN_COL: 'B'
})
