// Local modules
const areDatesEqual = require('../../src/are-dates-equal')

const DEC_31_2019 = {
  year: 2019,
  month: 12,
  day: 31
}

describe('are-dates-equal', () => {
  it('returns false if "date1" is falsy', () => {
    const date1 = null
    const date2 = DEC_31_2019

    expect(areDatesEqual(date1, date2)).toBe(false)
  })

  it('returns false if "date2" is falsy', () => {
    const date1 = DEC_31_2019
    const date2 = null

    expect(areDatesEqual(date1, date2)).toBe(false)
  })

  it('returns false if "date1" and "date2" have different "year"', () => {
    const date1 = DEC_31_2019
    const date2 = {
      ...DEC_31_2019,
      year: 2000
    }

    expect(areDatesEqual(date1, date2)).toBe(false)
  })

  it('returns false if "date1" and "date2" have different "month"', () => {
    const date1 = DEC_31_2019
    const date2 = {
      ...DEC_31_2019,
      month: 1
    }

    expect(areDatesEqual(date1, date2)).toBe(false)
  })

  it('returns false if "date1" and "date2" have different "day"', () => {
    const date1 = DEC_31_2019
    const date2 = {
      ...DEC_31_2019,
      day: 1
    }

    expect(areDatesEqual(date1, date2)).toBe(false)
  })

  it('returns true if "date1" and "date2" are the same object', () => {
    const date1 = DEC_31_2019
    const date2 = DEC_31_2019
    expect(date1).toBe(date2)
    expect(date1).toEqual(date2)
    expect(areDatesEqual(date1, date2)).toBe(true)
  })

  it('returns true if "date1" and "date2" have matching "year", "month", and "day" values', () => {
    const date1 = DEC_31_2019
    const date2 = {
      ...DEC_31_2019
    }
    expect(date1).not.toBe(date2)
    expect(date1).toEqual(date2)
    expect(areDatesEqual(date1, date2)).toBe(true)
  })
})
