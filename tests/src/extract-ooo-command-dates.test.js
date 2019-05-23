// Userland modules
const MockDate = require('mockdate')

// Local modules
const extractOooCommandDates = require('../../src/extract-ooo-command-dates')

describe('extract-ooo-command-dates', () => {
  let originalTZ

  beforeEach(() => {
    // Save for later
    originalTZ = process.env.TZ

    // Use UTC for all Date parsing
    process.env.TZ = 'UTC'

    // Set static date with UTC timezone
    MockDate.set('5/15/2019', 0)
  })

  afterEach(() => {
    MockDate.reset()

    // Restore
    delete process.env.TZ
    if (originalTZ) {
      process.env.TZ = originalTZ
    }
  })

  it('returns null for a comment not containing any command', () => {
    expect(extractOooCommandDates('OOO on 5/22')).toBe(null)
  })

  it('returns null for a comment containing a non-OOO command', () => {
    expect(extractOooCommandDates('/OutOfOffice on 5/22')).toBe(null)
  })

  it('returns null for a comment containing no recognizable date', () => {
    expect(extractOooCommandDates('/OOO whenever')).toEqual({ startDate: null, endDate: null })
  })

  it('returns expected values for single date in M/D format in the current year', () => {
    expect(extractOooCommandDates('/OOO on 5/22')).toMatchSnapshot()
    expect(extractOooCommandDates('/OOO from 5/22')).toMatchSnapshot()
  })

  it('returns expected values for single date as a range in M/D format in the current year', () => {
    expect(extractOooCommandDates('/OOO from 5/22 to 5/22')).toMatchSnapshot()
  })

  it('returns expected values for a date range in M/D format in the current year', () => {
    expect(extractOooCommandDates('/OOO from 5/22 to 5/24')).toMatchSnapshot()
  })

  it('returns expected values for single date in M/D format in the next year', () => {
    expect(extractOooCommandDates('/OOO on 1/14')).toMatchSnapshot()
    expect(extractOooCommandDates('/OOO from 1/14')).toMatchSnapshot()
  })

  it('returns expected values for single date as a range in M/D format in the next year', () => {
    expect(extractOooCommandDates('/OOO from 1/14 to 1/14')).toMatchSnapshot()
  })

  it('returns expected values for a date range in M/D format in the next year', () => {
    expect(extractOooCommandDates('/OOO from 1/14 to 1/17')).toMatchSnapshot()
  })
})
