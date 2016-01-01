var test = require('tape')
var obj = require('./index')

test('Object example', function (t) {
  var a = { a: 1, b: 2, c: 3, d: 4 }
  t.deepEqual(obj.keys(a), [ 'a', 'b', 'c', 'd' ], 'Object.keys')
  t.deepEqual(obj.values(a), [ 1, 2, 3, 4 ], 'Object.values')
  t.deepEqual(obj.entries(a), [ ['a', 1], ['b', 2], ['c', 3], ['d', 4] ], 'Object.entries')
  t.end()
})
