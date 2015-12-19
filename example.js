var pc = require('./index')

module.exports = extend

function extend () {
  return pc(arguments, null, null, squish)
}

function squish (acc, value, key) {
  if (!acc) return value
  return pc(value, null, acc)
}

var a = new Map()
console.log(extend(a, { a: 1, b: 2 }, { c: 3 }, { a: 4, 0: 100 }, [ 1 ]))
console.log(a)
