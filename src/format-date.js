function leftPadWithZeroes(str, len) {
  str = '' + str
  len = len - str.length
  while (len > 0) {
    str = '0' + str
    len--
  }
  return str
}

function formatDate(date) {
  if (!date) return null
  if (Object.prototype.toString.call(date) === '[object Date]')
    return date.toISOString().slice(0, 10)
  return `${date.year}-${leftPadWithZeroes(date.month, 2)}-${leftPadWithZeroes(
    date.day,
    2
  )}`
}

module.exports = formatDate
