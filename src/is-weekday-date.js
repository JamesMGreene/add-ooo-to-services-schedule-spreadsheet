// Local modules
const formatDate = require('./format-date')

function isWeekdayDate(date) {
  if (!date) return false

  const realDate = new Date(formatDate(date) + 'T00:00:00.000Z')
  const dayOfWeek = realDate.getUTCDay()
  return 0 < dayOfWeek && dayOfWeek < 6
}

module.exports = isWeekdayDate
