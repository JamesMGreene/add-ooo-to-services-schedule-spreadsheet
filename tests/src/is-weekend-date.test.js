// Local modules
const isWeekendDate = require('../../src/is-weekend-date')

// Sunday
const MAY_12_2019 = {
  year: 2019,
  month: 5,
  day: 12
}

describe('is-weekend-date', () => {
  it('returns false for anything falsy', () => {
    expect(isWeekendDate(undefined)).toBe(false)
    expect(isWeekendDate(null)).toBe(false)
    expect(isWeekendDate(false)).toBe(false)
    expect(isWeekendDate(NaN)).toBe(false)
    expect(isWeekendDate(0)).toBe(false)
    expect(isWeekendDate('')).toBe(false)
  })

  it('returns false for Dates that are weekdays', () => {
    // Monday through Friday
    expect(isWeekendDate(new Date('2019-05-13T00:00:00.000'))).toBe(false)
    expect(isWeekendDate(new Date('2019-05-14T00:00:00.000'))).toBe(false)
    expect(isWeekendDate(new Date('2019-05-15T00:00:00.000'))).toBe(false)
    expect(isWeekendDate(new Date('2019-05-16T00:00:00.000'))).toBe(false)
    expect(isWeekendDate(new Date('2019-05-17T00:00:00.000'))).toBe(false)
  })

  it('returns true for Dates that are weekends', () => {
    // The prior Saturday
    expect(isWeekendDate(new Date('2019-05-11T00:00:00.000'))).toBe(true)
    // Sunday
    expect(isWeekendDate(new Date('2019-05-12T00:00:00.000'))).toBe(true)
    // The following Saturday
    expect(isWeekendDate(new Date('2019-05-18T00:00:00.000'))).toBe(true)
  })

  it('returns false for Date-like objects that are weekdays', () => {
    // Monday
    expect(
      isWeekendDate({
        ...MAY_12_2019,
        day: MAY_12_2019 + 1
      })
    ).toBe(false)

    // Tuesday
    expect(
      isWeekendDate({
        ...MAY_12_2019,
        day: MAY_12_2019 + 2
      })
    ).toBe(false)

    // Wednesday
    expect(
      isWeekendDate({
        ...MAY_12_2019,
        day: MAY_12_2019 + 3
      })
    ).toBe(false)

    // Thursday
    expect(
      isWeekendDate({
        ...MAY_12_2019,
        day: MAY_12_2019 + 4
      })
    ).toBe(false)

    // Friday
    expect(
      isWeekendDate({
        ...MAY_12_2019,
        day: MAY_12_2019 + 6
      })
    ).toBe(false)
  })

  it('returns true for Date-like objects that are weekends', () => {
    // The prior Saturday
    expect(
      isWeekendDate({
        ...MAY_12_2019,
        day: MAY_12_2019.day - 1
      })
    ).toBe(true)

    // Sunday
    expect(isWeekendDate(MAY_12_2019)).toBe(true)

    // The following Saturday
    expect(
      isWeekendDate({
        ...MAY_12_2019,
        day: MAY_12_2019.day + 6
      })
    ).toBe(true)
  })
})
