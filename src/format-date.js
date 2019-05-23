function formatDate(date) {
  if (!date) return null
  return date.toISOString().slice(0, 10)
}

module.exports = formatDate
