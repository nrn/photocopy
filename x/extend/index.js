var pc = require('../../index')
var slice = Array.prototype.slice

module.exports = extend

function extend (seed) {
  return pc(slice.call(arguments, 1), pc.cat, seed)
}
