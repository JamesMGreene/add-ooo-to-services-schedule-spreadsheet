function isRealDate(date) {
  return Object.prototype.toString.call(date) === '[object Date]'
}

function pad(num) {
  return (num < 10 ? '0' : '') + num
}

function formatDate(date) {
  if (!date) return null
  if (isRealDate(date)) return date.toISOString().slice(0, 10)
  return `${date.year}-${pad(date.month)}-${pad(date.day)}`
}

module.exports = formatDate
