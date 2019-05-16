// Local modules
const isWeekdayDate = require('../../src/is-weekday-date')

// Sunday
const MAY_12_2019 = {
  year: 2019,
  month: 5,
  day: 12
}

describe('is-weekday-date', () => {
  it('returns false for anything falsy', () => {
    expect(isWeekdayDate(undefined)).toBe(false)
    expect(isWeekdayDate(null)).toBe(false)
    expect(isWeekdayDate(false)).toBe(false)
    expect(isWeekdayDate(NaN)).toBe(false)
    expect(isWeekdayDate(0)).toBe(false)
    expect(isWeekdayDate('')).toBe(false)
  })

  it('returns true for Dates that are weekdays', () => {
    // Monday through Friday
    expect(isWeekdayDate(new Date('2019-05-13T00:00:00.000Z'))).toBe(true)
    expect(isWeekdayDate(new Date('2019-05-14T00:00:00.000Z'))).toBe(true)
    expect(isWeekdayDate(new Date('2019-05-15T00:00:00.000Z'))).toBe(true)
    expect(isWeekdayDate(new Date('2019-05-16T00:00:00.000Z'))).toBe(true)
    expect(isWeekdayDate(new Date('2019-05-17T00:00:00.000Z'))).toBe(true)
  })

  it('returns false for Dates that are weekends', () => {
    // The prior Saturday
    expect(isWeekdayDate(new Date('2019-05-11T00:00:00.000Z'))).toBe(false)
    // Sunday
    expect(isWeekdayDate(new Date('2019-05-12T00:00:00.000Z'))).toBe(false)
    // The following Saturday
    expect(isWeekdayDate(new Date('2019-05-18T00:00:00.000Z'))).toBe(false)
  })

  it('returns true for Date-like objects that are weekdays', () => {
    // Monday
    expect(
      isWeekdayDate({
        ...MAY_12_2019,
        day: MAY_12_2019.day + 1
      })
    ).toBe(true)

    // Tuesday
    expect(
      isWeekdayDate({
        ...MAY_12_2019,
        day: MAY_12_2019.day + 2
      })
    ).toBe(true)

    // Wednesday
    expect(
      isWeekdayDate({
        ...MAY_12_2019,
        day: MAY_12_2019.day + 3
      })
    ).toBe(true)

    // Thursday
    expect(
      isWeekdayDate({
        ...MAY_12_2019,
        day: MAY_12_2019.day + 4
      })
    ).toBe(true)

    // Friday
    expect(
      isWeekdayDate({
        ...MAY_12_2019,
        day: MAY_12_2019.day + 5
      })
    ).toBe(true)
  })

  it('returns false for Date-like objects that are weekends', () => {
    // The prior Saturday
    expect(
      isWeekdayDate({
        ...MAY_12_2019,
        day: MAY_12_2019.day - 1
      })
    ).toBe(false)

    // Sunday
    expect(isWeekdayDate(MAY_12_2019)).toBe(false)

    // The following Saturday
    expect(
      isWeekdayDate({
        ...MAY_12_2019,
        day: MAY_12_2019.day + 6
      })
    ).toBe(false)
  })
})
