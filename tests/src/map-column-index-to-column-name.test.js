// Local modules
const mapColumnIndexToColumnName = require('../../src/map-column-index-to-column-name')

const AToZArray = Array(26)
const maximumColumnIndex = 27 * 26 - 1

describe('map-column-index-to-column-name', () => {
  it('returns expected values for inputs between 0 and 25', () => {
    const expectedOutput = AToZArray.map((e, i) => String.fromCharCode(65 + i))
    const actualOutput = AToZArray.map((e, i) => mapColumnIndexToColumnName(i))
    expect(actualOutput).toEqual(expectedOutput)
  })

  it('returns expected values for inputs between 26 and 51', () => {
    const expectedOutput = AToZArray.map((e, i) => 'A' + String.fromCharCode(65 + i))
    const actualOutput = AToZArray.map((e, i) => mapColumnIndexToColumnName(26 + i))
    expect(actualOutput).toEqual(expectedOutput)
  })

  it('returns expected values for inputs between 52 and 77', () => {
    const expectedOutput = AToZArray.map((e, i) => 'B' + String.fromCharCode(65 + i))
    const actualOutput = AToZArray.map((e, i) => mapColumnIndexToColumnName(52 + i))
    expect(actualOutput).toEqual(expectedOutput)
  })

  it('returns expected value for the maximum allowed input', () => {
    expect(mapColumnIndexToColumnName(maximumColumnIndex)).toBe('ZZ')
  })

  it('throws for input over the maximum allowed', () => {
    expect(() => mapColumnIndexToColumnName(maximumColumnIndex + 1)).toThrowErrorMatchingSnapshot()
  })
})
