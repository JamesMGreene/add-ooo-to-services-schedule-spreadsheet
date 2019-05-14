// Local modules
const mapColumnIndexToColumnName = require('./map-column-index-to-column-name')

const dateCellMatch = /^\s*(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{4})\s*$/

function dateColumnMapper(value, i) {
  const col = mapColumnIndexToColumnName(i)
  const trimmedValue = (value || '').trim()

  const defaultVal = { value: null, col }

  if (!trimmedValue || !dateCellMatch.test(trimmedValue)) return defaultVal

  const [$0, month, day, year] = trimmedValue.match(dateCellMatch)
  return {
    value: {
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day)
    },
    col
  }
}

module.exports = dateColumnMapper
