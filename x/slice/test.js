var test = require('tape')
var slice = require('./index')

test('slice example', function (t) {
  t.deepEqual(slice([0, 1, 2], 1), [ 1, 2 ], 'remove first')
  t.deepEqual(slice([0, 1, 2], 0, 2), [ 0, 1 ], 'remove last')
  t.deepEqual(slice({a: 1, b: 2, c: 3, d: 4, e: 5}, 2, 3), {c: 3}, 'leave middle')
  t.deepEqual(slice({a: 1, b: 2, c: 3, d: 4, e: 5}, 1, 4, []), [ 2, 3, 4 ], 'leave middle array')
  t.end()
})
