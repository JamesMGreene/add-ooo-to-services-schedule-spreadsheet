// Cuz I don't want to do more math beyond "ZZ"
const maximumColumnIndex = 27 * 26 - 1

const alphaArray = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function mapColumnIndexToColumnName(i) {
  const columnNameArray = []
  const higher = Math.floor(i / 26)
  const lower = i % 26
  if (higher >= 27)
    throw new TypeError(
      `Unexpectedly high column index: ${i} (maximum allowed: ${maximumColumnIndex})`
    )
  if (higher < 1) return alphaArray[lower]

  return [higher - 1, lower].map(j => alphaArray[j]).join('')
}

module.exports = mapColumnIndexToColumnName
