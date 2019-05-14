// Userland modules
const { Toolkit } = require('actions-toolkit')
const { google } = require('googleapis')

// Test spreadsheet = 1GoMPfZBppYwKjdu_GR5ZCGhNBgocPfhvvSq4W6S3c2I
// Real spreadsheet = 1jaLzkVG3BmV2fPjcKoWPeq6kRXB9Lcpqk28r-DcPeZo
// process.env.SPREADSHEET_ID = '1GoMPfZBppYwKjdu_GR5ZCGhNBgocPfhvvSq4W6S3c2I'

// process.env.SHEET_NAME = '2019-neworg'
// process.env.DATE_ROW = '1'
// process.env.LOGIN_COL = 'B'

const requiredNonSecretEnvVars = [
  'SPREADSHEET_ID',
  'SHEET_NAME',
  'DATE_ROW',
  'LOGIN_COL',
]

const tools = new Toolkit({
  // If the event received is not included,
  // Toolkit will exit neutrally
  event: ['issues.opened'],

  // If the following environment variables are not present,
  // Toolkit will exit with a failure
  secrets: [
    'GOOGLE_API_CLIENT_EMAIL',
    'GOOGLE_API_PRIVATE_KEY',
    ...requiredNonSecretEnvVars
  ],
})

tools.log.info('Welcome!')

// Wrap into an `async` function so we can using `await`
async function main() {
  const {
    GOOGLE_API_CLIENT_EMAIL,
    GOOGLE_API_PRIVATE_KEY,
    SPREADSHEET_ID,
    SHEET_NAME,
    DATE_ROW,
    LOGIN_COL,
  } = process.env

  tools.log.info('Payload:')
  tools.log.info(JSON.stringify(tools.context.payload))

  // Configure a JWT auth client using the Service Account
  const jwtClient = new google.auth.JWT(
    GOOGLE_API_CLIENT_EMAIL,
    null,
    GOOGLE_API_PRIVATE_KEY,
    ['https://www.googleapis.com/auth/spreadsheets']
  )
  // Authenticate request (const tokens = )
  await jwtClient.authorize()

  const sheets = google.sheets('v4')

  const [dateRowRes, loginColRes] = await Promise.all([
    sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${SHEET_NAME}'!${DATE_ROW}:${DATE_ROW}`,
      auth: jwtClient
    }),
    sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${SHEET_NAME}'!${LOGIN_COL}:${LOGIN_COL}`,
      auth: jwtClient
    })
  ])

  tools.log.info('Date row res:')
  tools.log.info(JSON.stringify(dateRowRes))
  tools.log.info('Login column res:')
  tools.log.info(JSON.stringify(loginColRes))

  tools.exit.success('We did it!')
}

// Run the main function
main().catch(err => tools.exit.failure(err.stack))
