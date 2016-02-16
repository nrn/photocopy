var done = require('./done')
var reduce = require('universal-reduce')
var splay = require('splay')

module.exports = sort

function sort (fn) {
  return function (next) {
    var root = null
    return function (acc, val, key) {
      if (done(acc, val, key)) {
        return next(reduce._reduce(splay.seqRead(root), function (iacc, node) {
          return next(iacc, node.value, node.key)
        }, acc))
      }
      root = splay.insert(root, new splay.Node(key, val), fn)
      return acc
    }
  }
}
