function isWeekdayDate(date) {
  if (!date) return false

  const dayOfWeek = date.getUTCDay()
  return 0 < dayOfWeek && dayOfWeek < 6
}

module.exports = isWeekdayDate
