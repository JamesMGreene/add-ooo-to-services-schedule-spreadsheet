// Local modules
const getActualValueFromExtendedValue = require('../../src/get-actual-value-from-extended-value')

const errorValue = { type: '#REF!', message: 'Something went awry' }
const formulaValue =
  '=HYPERLINK("https://github.com/JamesMGreene/faux-services-actions-test/issues/23", "OOO")'
const stringValue = 'OOO'
const numberValue = 3.5
const boolValue = false

describe('get-actual-value-from-extended-value', () => {
  it('returns null for anything falsy', () => {
    expect(getActualValueFromExtendedValue(undefined)).toBe(null)
    expect(getActualValueFromExtendedValue(null)).toBe(null)
    expect(getActualValueFromExtendedValue(false)).toBe(null)
    expect(getActualValueFromExtendedValue(NaN)).toBe(null)
    expect(getActualValueFromExtendedValue(0)).toBe(null)
    expect(getActualValueFromExtendedValue('')).toBe(null)
  })

  it('returns errorValue with priority #1 when present', () => {
    const extendedValue = {
      errorValue,
      formulaValue,
      stringValue,
      numberValue,
      boolValue
    }
    expect(getActualValueFromExtendedValue(extendedValue)).toEqual(errorValue)
  })

  it('returns formulaValue with priority #2 when present', () => {
    const extendedValue = {
      formulaValue,
      stringValue,
      numberValue,
      boolValue
    }
    expect(getActualValueFromExtendedValue(extendedValue)).toBe(formulaValue)
  })

  it('returns stringValue with priority #3 when present', () => {
    const extendedValue = {
      stringValue,
      numberValue,
      boolValue
    }
    expect(getActualValueFromExtendedValue(extendedValue)).toBe(stringValue)
  })

  it('returns numberValue with priority #4 when present', () => {
    const extendedValue = {
      numberValue,
      boolValue
    }
    expect(getActualValueFromExtendedValue(extendedValue)).toBe(numberValue)
  })

  it('returns boolValue with priority #5 when present', () => {
    const extendedValue = {
      boolValue
    }
    expect(getActualValueFromExtendedValue(extendedValue)).toBe(boolValue)
  })

  it('returns null if none of the expected values are present', () => {
    const extendedValue = {}
    expect(getActualValueFromExtendedValue(extendedValue)).toBe(null)
  })
})
