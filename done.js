var reduce = require('universal-reduce')

module.exports = done

function done (acc, value, key) {
  return (
    (typeof value === 'undefined' &&
     typeof value === 'undefined') ||
    (reduce.isReduced(acc))
  )
}

