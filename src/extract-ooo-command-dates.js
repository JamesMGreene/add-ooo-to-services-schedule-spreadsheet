// Userland modules
const Sherlock = require('sherlockjs')

const commandMatch = /^\/([\w]+)\b *(.*)?$/m

function convertDateToObject(date) {
  if (!date) return null

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  }
}

function extractOooCommandDates(text) {
  const command = (text || '').match(commandMatch)

  if (
    !command ||
    !command[1] ||
    !command[2] ||
    command[1].toLowerCase() !== 'ooo'
  ) {
    return null
  }

  const args = Sherlock.parse(command[2])
  const startDate = convertDateToObject(args.startDate)
  const endDate = convertDateToObject(args.endDate)

  return {
    startDate: startDate,
    endDate: endDate || startDate
  }
}

module.exports = extractOooCommandDates
