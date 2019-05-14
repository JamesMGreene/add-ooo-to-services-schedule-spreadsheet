function areDatesEqual(date1, date2) {
  if (!date1 || !date2) return false

  return (
    date1.year === date2.year &&
    date1.month === date2.month &&
    date1.day === date2.month
  )
}

module.exports = areDatesEqual
