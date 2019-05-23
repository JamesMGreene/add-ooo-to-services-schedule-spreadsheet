// Node.js core modules
const path = require('path')

// Userland modules
const { Toolkit } = require('actions-toolkit')
const { google } = require('googleapis')
const { sheets_v4 } = require('googleapis/build/src/apis/sheets/v4')

function mockToolkit(fixture, toolkitOptions = {}) {
  // Load the relevant JSON file
  const fixtureSubpath = `${fixture}.json`.split('/')
  process.env.GITHUB_EVENT_PATH = path.join(
    __dirname,
    'fixtures',
    'github',
    'issue_comment.created',
    'event',
    ...fixtureSubpath
  )

  // Silence warning
  Toolkit.prototype.warnForMissingEnvVars = jest.fn()

  // Silence the logger
  toolkitOptions.logger = {
    info: jest.fn(),
    success: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    error: jest.fn()
  }

  const tools = new Toolkit(toolkitOptions)

  // Mock the toolkit `exit.*` functions
  tools.exit.neutral = jest.fn()
  tools.exit.failure = jest.fn()
  tools.exit.success = jest.fn()

  return tools
}

describe('add-ooo-to-spreadsheet', () => {
  let runAction, toolkitOptions

  beforeEach(() => {
    Toolkit.run = jest.fn((fn, opts) => {
      runAction = fn
      toolkitOptions = opts
    })

    require('../index')
  })

  it('exits neutral for issues without an OOO indicator in the title', async () => {
    const tools = mockToolkit('neutral/not-from-an-ooo-issue', toolkitOptions)
    await runAction(tools)
    expect(tools.exit.failure).not.toHaveBeenCalled()
    expect(tools.exit.success).not.toHaveBeenCalled()
    expect(tools.exit.neutral).toHaveBeenCalled()
    expect(tools.exit.neutral.mock.calls).toMatchSnapshot()
  })

  it('exits neutral for issue comment from a bot', async () => {
    const tools = mockToolkit('neutral/comment-from-bot', toolkitOptions)
    await runAction(tools)
    expect(tools.exit.failure).not.toHaveBeenCalled()
    expect(tools.exit.success).not.toHaveBeenCalled()
    expect(tools.exit.neutral).toHaveBeenCalled()
    expect(tools.exit.neutral.mock.calls).toMatchSnapshot()
  })

  it('exits neutral for issue comment not from issue author', async () => {
    const tools = mockToolkit('neutral/not-from-issue-author', toolkitOptions)
    await runAction(tools)
    expect(tools.exit.failure).not.toHaveBeenCalled()
    expect(tools.exit.success).not.toHaveBeenCalled()
    expect(tools.exit.neutral).toHaveBeenCalled()
    expect(tools.exit.neutral.mock.calls).toMatchSnapshot()
  })

  it('exits neutral for issue comment not containing an OOO command', async () => {
    const tools = mockToolkit('neutral/not-an-ooo-command', toolkitOptions)
    await runAction(tools)
    expect(tools.exit.failure).not.toHaveBeenCalled()
    expect(tools.exit.success).not.toHaveBeenCalled()
    expect(tools.exit.neutral).toHaveBeenCalled()
    expect(tools.exit.neutral.mock.calls).toMatchSnapshot()
  })

  it('exits failure for OOO command without identifiable dates', async () => {
    const tools = mockToolkit('failure/ooo-command-without-dates', toolkitOptions)
    await runAction(tools)
    expect(tools.exit.neutral).not.toHaveBeenCalled()
    expect(tools.exit.success).not.toHaveBeenCalled()
    expect(tools.exit.failure).toHaveBeenCalled()
    expect(tools.exit.failure.mock.calls).toMatchSnapshot()
  })

  describe('with valid OOO commands', () => {
    const originalMethods = {}

    beforeEach(async () => {
      // Save for later
      Object.assign(originalMethods, {
        authorize: google.auth.JWT.prototype.authorize,
        get: sheets_v4.Resource$Spreadsheets.prototype.get,
        valuesGet: sheets_v4.Resource$Spreadsheets$Values.prototype.get,
        valuesBatchUpdate: sheets_v4.Resource$Spreadsheets$Values.prototype.batchUpdate
      })

      // Mock the various Google API methods as necessary
      google.auth.JWT.prototype.authorize = jest.fn()
      sheets_v4.Resource$Spreadsheets.prototype.get = jest.fn()
      sheets_v4.Resource$Spreadsheets$Values.prototype.get = jest.fn()
      sheets_v4.Resource$Spreadsheets$Values.prototype.batchUpdate = jest.fn()

      sheets_v4.Resource$Spreadsheets$Values.prototype.get.mockImplementation(
        ({ majorDimension }) => {
          if (majorDimension === 'ROWS') {
            return require('./fixtures/google/values.get/date-row-response.json')
          } else if (majorDimension === 'COLUMNS') {
            return require('./fixtures/google/values.get/login-column-response.json')
          }
          return null
        }
      )

      sheets_v4.Resource$Spreadsheets.prototype.get.mockImplementation(({ ranges }) => {
        if (ranges.length === 1) {
          return require('./fixtures/google/get/one-date-response.json')
        } else if (ranges.length > 1) {
          return require('./fixtures/google/get/two-dates-response.json')
        }
        return null
      })

      sheets_v4.Resource$Spreadsheets$Values.prototype.batchUpdate.mockImplementation(
        ({ resource: { data } }) => {
          if (data.length === 1) {
            return require('./fixtures/google/values.batchUpdate/one-date-response.json')
          } else if (data.length > 1) {
            return require('./fixtures/google/values.batchUpdate/two-dates-response.json')
          }
          return null
        }
      )
    })

    afterEach(async () => {
      // Restore
      google.auth.JWT.prototype.authorize = originalMethods.authorize
      sheets_v4.Resource$Spreadsheets.prototype.get = originalMethods.get
      sheets_v4.Resource$Spreadsheets$Values.prototype.get = originalMethods.valuesGet
      sheets_v4.Resource$Spreadsheets$Values.prototype.batchUpdate =
        originalMethods.valuesBatchUpdate
    })

    it('exits failure for OOO command from an unrecognized author', async () => {
      const tools = mockToolkit('failure/no-entry-for-author', toolkitOptions)
      await runAction(tools)
      expect(tools.exit.neutral).not.toHaveBeenCalled()
      expect(tools.exit.success).not.toHaveBeenCalled()
      expect(tools.exit.failure).toHaveBeenCalled()
      expect(tools.exit.failure.mock.calls).toMatchSnapshot()
    })

    it('exits failure for OOO command for unrecognized dates', async () => {
      const tools = mockToolkit('failure/no-entry-for-date', toolkitOptions)
      await runAction(tools)
      expect(tools.exit.neutral).not.toHaveBeenCalled()
      expect(tools.exit.success).not.toHaveBeenCalled()
      expect(tools.exit.failure).toHaveBeenCalled()
      expect(tools.exit.failure.mock.calls).toMatchSnapshot()
    })

    it('exits failure for OOO command for weekend-only dates', async () => {
      const tools = mockToolkit('failure/only-weekend-dates', toolkitOptions)
      await runAction(tools)
      expect(tools.exit.neutral).not.toHaveBeenCalled()
      expect(tools.exit.success).not.toHaveBeenCalled()
      expect(tools.exit.failure).toHaveBeenCalled()
      expect(tools.exit.failure.mock.calls).toMatchSnapshot()
    })

    it('exits success for OOO command for single date', async () => {
      const tools = mockToolkit('success/one-date', toolkitOptions)

      tools.github.issues.createComment = jest.fn(() => {
        return require('./fixtures/github/issue_comment.created/response/success/one-date.json')
      })

      await runAction(tools)
      expect(tools.exit.failure).not.toHaveBeenCalled()
      expect(tools.exit.neutral).not.toHaveBeenCalled()
      expect(tools.exit.success).toHaveBeenCalled()
      expect(tools.exit.success.mock.calls).toMatchSnapshot()
      expect(tools.github.issues.createComment).toHaveBeenCalled()
      expect(tools.github.issues.createComment.mock.calls).toMatchSnapshot()
    })

    it('exits success for OOO command for range for one date', async () => {
      const tools = mockToolkit('success/range-for-one-date', toolkitOptions)

      tools.github.issues.createComment = jest.fn(() => {
        return require('./fixtures/github/issue_comment.created/response/success/one-date.json')
      })

      await runAction(tools)
      expect(tools.exit.failure).not.toHaveBeenCalled()
      expect(tools.exit.neutral).not.toHaveBeenCalled()
      expect(tools.exit.success).toHaveBeenCalled()
      expect(tools.exit.success.mock.calls).toMatchSnapshot()
      expect(tools.github.issues.createComment).toHaveBeenCalled()
      expect(tools.github.issues.createComment.mock.calls).toMatchSnapshot()
    })

    it('exits success for OOO command for range for two dates', async () => {
      const tools = mockToolkit('success/range-for-two-dates', toolkitOptions)

      tools.github.issues.createComment = jest.fn(() => {
        return require('./fixtures/github/issue_comment.created/response/success/two-dates.json')
      })

      await runAction(tools)
      expect(tools.exit.failure).not.toHaveBeenCalled()
      expect(tools.exit.neutral).not.toHaveBeenCalled()
      expect(tools.exit.success).toHaveBeenCalled()
      expect(tools.exit.success.mock.calls).toMatchSnapshot()
      expect(tools.github.issues.createComment).toHaveBeenCalled()
      expect(tools.github.issues.createComment.mock.calls).toMatchSnapshot()
    })
  })
})
