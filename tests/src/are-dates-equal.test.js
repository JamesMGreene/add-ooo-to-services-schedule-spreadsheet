// Local modules
const areDatesEqual = require('../../src/are-dates-equal')

const DEC_31_2019 = new Date('2019-12-31T00:00:00.000Z')

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

  it('returns false if "date1" and "date2" have different year', () => {
    const date1 = DEC_31_2019
    const date2 = new Date('2000' + DEC_31_2019.toISOString().slice(4))

    expect(areDatesEqual(date1, date2)).toBe(false)
  })

  it('returns false if "date1" and "date2" have different month', () => {
    const iso = DEC_31_2019.toISOString()
    const date1 = DEC_31_2019
    const date2 = new Date(iso.slice(0, 5) + '01' + iso.slice(7))

    expect(areDatesEqual(date1, date2)).toBe(false)
  })

  it('returns false if "date1" and "date2" have different day', () => {
    const iso = DEC_31_2019.toISOString()
    const date1 = DEC_31_2019
    const date2 = new Date(iso.slice(0, 8) + '01' + iso.slice(10))

    expect(areDatesEqual(date1, date2)).toBe(false)
  })

  it('returns true if "date1" and "date2" are the same object', () => {
    const date1 = DEC_31_2019
    const date2 = DEC_31_2019
    expect(date1).toBe(date2)
    expect(date1).toEqual(date2)
    expect(areDatesEqual(date1, date2)).toBe(true)
  })

  it('returns true if "date1" and "date2" contain equal values', () => {
    const date1 = DEC_31_2019
    const date2 = new Date(date1.toISOString())
    expect(date1).not.toBe(date2)
    expect(date1).toEqual(date2)
    expect(areDatesEqual(date1, date2)).toBe(true)
  })
})
