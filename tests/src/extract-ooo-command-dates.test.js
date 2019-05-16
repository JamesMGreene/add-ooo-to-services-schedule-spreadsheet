// Userland modules
const MockDate = require('mockdate')

// Local modules
const extractOooCommandDates = require('../../src/extract-ooo-command-dates')

const MAY_22_2019 = {
  year: 2019,
  month: 5,
  day: 22
}
const JAN_14_2020 = {
  year: 2020,
  month: 1,
  day: 14
}

describe('extract-ooo-command-dates', () => {
  let originalTZ

  beforeEach(() => {
    // Save for later
    originalTZ = process.env.TZ

    // Use UTC for for all Date parsing
    process.env.TZ = 'UTC'

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

  it('returns expected values for single date in M/D format in the current year', () => {
    expect(extractOooCommandDates('/OOO on 5/22')).toEqual({
      startDate: MAY_22_2019,
      endDate: MAY_22_2019
    })
    expect(extractOooCommandDates('/OOO from 5/22')).toEqual({
      startDate: MAY_22_2019,
      endDate: MAY_22_2019
    })
  })

  it('returns expected values for single date as a range in M/D format in the current year', () => {
    expect(extractOooCommandDates('/OOO from 5/22 to 5/22')).toEqual({
      startDate: MAY_22_2019,
      endDate: MAY_22_2019
    })
  })

  it('returns expected values for a date range in M/D format in the current year', () => {
    expect(extractOooCommandDates('/OOO from 5/22 to 5/24')).toEqual({
      startDate: MAY_22_2019,
      endDate: {
        ...MAY_22_2019,
        day: 24
      }
    })
  })

  it('returns expected values for single date in M/D format in the next year', () => {
    expect(extractOooCommandDates('/OOO on 1/14')).toEqual({
      startDate: JAN_14_2020,
      endDate: JAN_14_2020
    })
    expect(extractOooCommandDates('/OOO from 1/14')).toEqual({
      startDate: JAN_14_2020,
      endDate: JAN_14_2020
    })
  })

  it('returns expected values for single date as a range in M/D format in the next year', () => {
    expect(extractOooCommandDates('/OOO from 1/14 to 1/14')).toEqual({
      startDate: JAN_14_2020,
      endDate: JAN_14_2020
    })
  })

  it('returns expected values for a date range in M/D format in the next year', () => {
    expect(extractOooCommandDates('/OOO from 1/14 to 1/17')).toEqual({
      startDate: JAN_14_2020,
      endDate: {
        ...JAN_14_2020,
        day: 17
      }
    })
  })
})
