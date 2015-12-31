var pc = require('../../index')

module.exports = slice

function slice (collection, start, end, seed) {
  start || (start = 0)
  if (typeof end === 'number') {
    return pc(collection, pc.comp(pc.skip(start), pc.take(end - start)), seed)
  }
  return pc(collection, pc.skip(start), seed)
}