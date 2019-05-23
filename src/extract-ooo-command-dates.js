// Userland modules
const Sherlock = require('sherlockjs')

const commandMatch = /^\/([\w]+)\b *(.*)?$/m

function extractOooCommandDates(text) {
  const command = (text || '').match(commandMatch)

  if (!command || !command[1] || !command[2] || command[1].toLowerCase() !== 'ooo') {
    return null
  }

  const args = Sherlock.parse(command[2])
  const { startDate, endDate } = args

  return {
    startDate: startDate || endDate || null,
    endDate: endDate || startDate || null
  }
}

module.exports = extractOooCommandDates
