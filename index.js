// Use UTC for for all Date parsing
process.env.TZ = 'UTC'

// Userland modules
const { Toolkit } = require('actions-toolkit')
const { google } = require('googleapis')
const dateColumnMapper = require('./src/date-column-mapper')
const loginRowMapperGenerator = require('./src/login-row-mapper-generator')
const extractOooCommandDates = require('./src/extract-ooo-command-dates')
const areDatesEqual = require('./src/are-dates-equal')
const formatDate = require('./src/format-date')

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
  event: ['issue_comment.created'],

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

  tools.log.info('Payload:')
  tools.log.info(JSON.stringify(tools.context.payload))

  const { issue, comment } = tools.context.payload
  const issueCreatorLogin = issue.user.login.toLowerCase()
  const issueTitle = issue.title
  const issueTitleLower = issueTitle.toLowerCase()
  const issueBody = issue.body
  const issueUrl = issue.html_url

  // Exit early neutrally if the issue is not an OOO issue
  if (
    !(
      issueTitleLower.includes('ooo') ||
      issueTitleLower.includes('out of office')
    )
  ) {
    tools.exit.neutral('This is not an OOO issue')
  }

  // Exit early neutrally if the issue comment is from a bot
  if (comment.user.type === 'Bot') {
    tools.exit.neutral('This comment is from a bot')
  }

  // Exit early neutrally if the issue comment is not from the issue's original author
  if (issue.user.id !== comment.user.id) {
    tools.exit.neutral('This comment is not from the OOO issue author')
  }

  const extraction = extractOooCommandDates(comment.body)
  if (!extraction) {
    tools.exit.neutral('This comment does not contain an OOO slash command')
  }

  const { startDate, endDate } = extraction
  if (!startDate || !endDate) {
    tools.exit.failure('This OOO command does not contain identifiable dates')
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

  const [dateRowRes, loginColRes] = await Promise.all([
    sheets.spreadsheets.values.get({
      auth: jwtClient,
      spreadsheetId: SPREADSHEET_ID,
      range: `'${SHEET_NAME}'!${DATE_ROW}:${DATE_ROW}`,
      majorDimension: 'ROWS'
    }),
    sheets.spreadsheets.values.get({
      auth: jwtClient,
      spreadsheetId: SPREADSHEET_ID,
      range: `'${SHEET_NAME}'!${LOGIN_COL}:${LOGIN_COL}`,
      majorDimension: 'COLUMNS'
    })
  ])

  const dateColCells = dateRowRes.data.values[0].map(dateColumnMapper)
  const loginRowCells = loginColRes.data.values[0].map(loginRowMapper)

  tools.log.info('Date column cells:')
  tools.log.info(JSON.stringify(dateColCells))
  tools.log.info('Login row cells:')
  tools.log.info(JSON.stringify(loginRowCells))

  const loginRowCellForIssueCreator = loginRowCells.find(
    c => c.value && c.value.login === issueCreatorLogin
  )
  if (!loginRowCellForIssueCreator) {
    tools.exit.failure(
      `Could not find row cell matching issue creator's login "${issueCreatorLogin}" for issue: ${issueUrl}`
    )
  }

  tools.log.info('Found row cell for issue creator!')
  tools.log.info(JSON.stringify(loginRowCellForIssueCreator))

  const dateColumnCellForStartIndex = dateColCells.findIndex(c =>
    areDatesEqual(c.value, startDate)
  )
  const dateColumnCellForEndIndex = areDatesEqual(startDate, endDate)
    ? dateColumnCellForStartIndex
    : dateColCells.findIndex(c => areDatesEqual(c.value, endDate))

  if (dateColumnCellForStartIndex === -1 || dateColumnCellForEndIndex === -1) {
    tools.exit.failure(
      `Could not find column cells matching issue date range (${formatDate(
        startDate
      )} - ${formatDate(endDate)}) for issue: ${issueUrl}`
    )
  }

  const dateColumnCellForStart = dateColCells[dateColumnCellForStartIndex]
  const dateColumnCellForEnd = dateColCells[dateColumnCellForEndIndex]

  tools.log.info('Found column cell for start date!')
  tools.log.info(JSON.stringify(dateColumnCellForStart))
  tools.log.info('Found column cell for end date!')
  tools.log.info(JSON.stringify(dateColumnCellForEnd))

  // const updateRes = await sheets.spreadsheets.batchUpdate({
  //   auth: jwtClient,
  //   spreadsheetId: SPREADSHEET_ID,
  //   // requestBody or resource? The API docs disagree.
  //   resource: {
  //     // A list of updates to apply to the spreadsheet.
  //     // Requests will be applied in the order they are specified.
  //     // If any request is not valid, no requests will be applied.
  //     requests: [
  //       // ?
  //     ]
  //   }
  // })

  tools.exit.success('We did it!')
}

// Run the main function
main().catch(err => tools.exit.failure(err.stack))
