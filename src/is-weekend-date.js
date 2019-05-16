// Local modules
const formatDate = require('./format-date')

const weekendDayCodes = [0, 6]

function isWeekendDate(date) {
  if (!date) return false

  // CRITICAL: Do NOT specify the time zone!
  const realDate = new Date(formatDate(date) + 'T00:00:00.000')
  return weekendDayCodes.includes(realDate.getDay())
}

module.exports = isWeekendDate
