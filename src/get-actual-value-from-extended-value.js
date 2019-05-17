// Sort-of reference:
// https://developers.google.com/resources/api-libraries/documentation/sheets/v4/csharp/latest/classGoogle_1_1Apis_1_1Sheets_1_1v4_1_1Data_1_1ExtendedValue.html

const propertyPreferences = [
  'errorValue',
  'formulaValue',
  'stringValue',
  'numberValue',
  'boolValue'
]

function getActualValueFromExtendedValue(extendedValue) {
  if (!extendedValue) return null

  for (let propName of propertyPreferences) {
    if (extendedValue.hasOwnProperty(propName)) return extendedValue[propName]
  }

  return null
}

module.exports = getActualValueFromExtendedValue
