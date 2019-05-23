// Local modules
const formatDate = require('../../src/format-date')

describe('format-date', () => {
  it('returns null for anything falsy', () => {
    expect(formatDate(undefined)).toBe(null)
    expect(formatDate(null)).toBe(null)
    expect(formatDate(false)).toBe(null)
    expect(formatDate(NaN)).toBe(null)
    expect(formatDate(0)).toBe(null)
    expect(formatDate('')).toBe(null)
  })

  it('returns expected value for Date with double-digit month and day', () => {
    const date = new Date('2019-12-31T00:00:00.000Z')
    expect(formatDate(date)).toBe('2019-12-31')
  })

  it('returns expected value for Date with single-digit month and day', () => {
    const date = new Date('2020-01-07T00:00:00.000Z')
    expect(formatDate(date)).toBe('2020-01-07')
  })
})
