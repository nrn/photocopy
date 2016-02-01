const pc = require('../../index')

module.exports = function morph (collection, parametrics, seed) {
  if (typeof parametrics === 'function') {
    var f = parametrics
  } else if (typeof parametrics === 'object' && !Array.isArray(parametrics)) {
    if (
      typeof parametrics.key !== 'function' ||
      typeof parametrics.value !== 'function'
    ) throw new Error('morph expects an object containing transform functions with keys "key" and "value"')

    var f = parametrics.value
    var g = parametrics.key
  } else {
    throw new Error('morph expects either a function or an object containing parametric functions for its second parameter')
  }

  return pc(collection, morphTransformer(f, g), seed)
}

function morphTransformer (f, g) {
  return function (next) {
    return function (acc, val, key) {
      if (pc.done(acc, val, key)) return acc

      var v = (g == null)
        ? f(val, key)
        : [f(val, key), g(val, key)]

      return next(acc, v[0], v[1])
    }
  }
}
