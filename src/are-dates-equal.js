// Local modules
const formatDate = require('./format-date')

function areDatesEqual(date1, date2) {
  if (!date1 || !date2) return false
  return formatDate(date1) === formatDate(date2)
}

module.exports = areDatesEqual
