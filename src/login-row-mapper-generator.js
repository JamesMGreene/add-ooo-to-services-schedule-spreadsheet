// Local modules
const mapRowIndexToRowName = require('./map-row-index-to-row-name')

const loginValuesToIgnore = ['to be hired', 'comms']

function loginRowMapperGenerator() {
  let hitLegend = false

  return function loginRowMapper(value, i) {
    // Reset the `hitLegend` boolean so this mapper function can be reused (just not in parallel)
    if (i === 0) {
      hitLegend = false
    }

    const row = mapRowIndexToRowName(i)
    const trimmedLowerValue = (value || '').trim().toLowerCase()

    const defaultVal = { value: null, row }

    if (hitLegend) return defaultVal

    if (!trimmedLowerValue || loginValuesToIgnore.includes(trimmedLowerValue))
      return defaultVal

    if (trimmedLowerValue === 'legend') {
      hitLegend = true
      return defaultVal
    }

    const [login] = trimmedLowerValue.split(/\s/, 1)
    return {
      value: { login },
      row
    }
  }
}

module.exports = loginRowMapperGenerator
