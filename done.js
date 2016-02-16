var reduce = require('universal-reduce')

module.exports = done

function done (acc, value, key) {
  return (
    (typeof value === 'undefined' &&
     typeof key === 'undefined') ||
    (reduce.isReduced(acc))
  )
}

