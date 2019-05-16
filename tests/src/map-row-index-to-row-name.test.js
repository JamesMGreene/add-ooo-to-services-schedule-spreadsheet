// Local modules
const mapRowIndexToRowName = require('../../src/map-row-index-to-row-name')

describe('map-row-index-to-row-name', () => {
  it('returns expected values for input 0', () => {
    expect(mapRowIndexToRowName(0)).toBe('1')
  })

  it('returns expected values for input 25', () => {
    expect(mapRowIndexToRowName(25)).toBe('26')
  })

  it('returns expected values for input 26', () => {
    expect(mapRowIndexToRowName(26)).toBe('27')
  })

  it('returns expected values for input 27', () => {
    expect(mapRowIndexToRowName(27)).toBe('28')
  })

  it('returns expected values for input 99', () => {
    expect(mapRowIndexToRowName(99)).toBe('100')
  })
})
