// Node.js core modules
const path = require('path')

Object.assign(process.env, {
  GITHUB_REPOSITORY: 'JamesMGreene/faux-services-actions-test',
  GITHUB_ACTION: 'add-ooo-to-services-schedule-spreadsheet',
  GITHUB_EVENT_PATH: path.join(__dirname, 'fixtures', 'event.json'),
  GITHUB_WORKSPACE: path.join(__dirname, 'fixtures')
})
