// Userland modules
const { Toolkit } = require('actions-toolkit')
const { google } = require('googleapis')
const dateColumnMapper = require('./src/date-column-mapper')
const loginRowMapperGenerator = require('./src/login-row-mapper-generator')
const areDatesEqual = require('./src/are-dates-equal')

// IMPORTANT: This mapper can only be used serially
const loginRowMapper = loginRowMapperGenerator()

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
  'LOGIN_COL'
]

const tools = new Toolkit({
  // If the event received is not included,
  // Toolkit will exit neutrally
  event: ['issues.opened'],

  // If the following environment variables are not present,
  // Toolkit will exit with a failure
  secrets: [
    // The email address of a GCP Service Account with access to the spreadsheet
    'GOOGLE_API_CLIENT_EMAIL',
    // The private key of a GCP Service Account with access to the spreadsheet
    'GOOGLE_API_PRIVATE_KEY',
    ...requiredNonSecretEnvVars
  ]
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
    LOGIN_COL
  } = process.env

  const { issue } = tools.context.payload
  const issueCreatorLogin = issue.user.login.toLowerCase()
  const issueTitle = issue.title
  const issueTitleLower = issueTitle.toLowerCase()
  const issueBody = issue.body
  const issueUrl = issue.html_url
  const oooStartDate = ''
  const oooEndDate = ''

  // Exit early neutrally if the issue is not an OOO issue
  if (
    !(
      issueTitleLower.includes('ooo') ||
      issueTitleLower.includes('out of office')
    )
  ) {
    tools.exit.neutral('This is not an OOO issue')
  }

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

  const batchGetRes = sheets.spreadsheets.values.batchGet({
    auth: jwtClient,
    spreadsheetId: SPREADSHEET_ID,
    ranges: [
      `'${SHEET_NAME}'!${DATE_ROW}:${DATE_ROW}`,
      `'${SHEET_NAME}'!${LOGIN_COL}:${LOGIN_COL}`
    ]
  })

  tools.log.info('Batch response:')
  tools.log.info(JSON.stringify(batchGetRes))

  tools.exit.neutral('HALT EARLY')

  const dateColCells = dateRowRes.data.values[0].map(dateColumnMapper)
  const loginRowCells = loginColRes.data.values.map(loginRowMapper)

  tools.log.info('Payload:')
  tools.log.info(JSON.stringify(tools.context.payload))
  tools.log.info('Date column cells:')
  tools.log.info(JSON.stringify(dateColCells))
  tools.log.info('Login row cells:')
  tools.log.info(JSON.stringify(loginRowCells))

  const loginRowCellForIssueCreator = loginRowCells.find(
    c => c.value.login === issueCreatorLogin
  )
  if (!loginRowCellForIssueCreator) {
    tools.exit.failure(
      `Could not find row cell matching issue creator's login "${issueCreatorLogin}" for issue: ${issueUrl}`
    )
  }

  tools.log.info('Found row cell for issue creator!')
  tools.log.info(JSON.stringify(loginRowCellForIssueCreator))

  const dateColumnCellForStart = dateColCells.find(c =>
    areDatesEqual(c.value, oooStartDate)
  )
  const dateColumnCellForEnd = areDatesEqual(oooStartDate, oooEndDate)
    ? dateColumnCellForStart
    : dateColCells.find(c => areDatesEqual(c.value, oooEndDate))
  if (!dateColumnCellForStart || !dateColumnCellForEnd) {
    tools.exit.failure(
      `Could not find column cells matching issue date range (${oooStartDate} - ${oooEndDate}) for issue: ${issueUrl}`
    )
  }

  tools.log.info('Found column cell for start date!')
  tools.log.info(JSON.stringify(dateColumnCellForStart))
  tools.log.info('Found column cell for end date!')
  tools.log.info(JSON.stringify(dateColumnCellForEnd))

  // const updateRes = await sheets.spreadsheets.batchUpdate({
  //   auth: jwtClient,
  //   spreadsheetId: SPREADSHEET_ID,
  //   range: `'${SHEET_NAME}'!${DATE_ROW}:${DATE_ROW}`
  // })

  tools.exit.success('We did it!')
}

// Run the main function
main().catch(err => tools.exit.failure(err.stack))
