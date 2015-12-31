var test = require('tape')
var unique = require('./index')

test('unique example', function (t) {
  t.deepEqual(unique([1, 1, 2, 2]), [1, 2], 'same numbers in array')
  var a = { an: 'object' }
  t.deepEqual(unique({ foo: a, bar: a }, []), [a], '{key: object} to [ object ]')
  t.end()
})

