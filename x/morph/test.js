var test = require('tape')
var morph = require('./index')

var lookup = ['red', 'white', 'blue']

test('morph', function (t) {
  const result1 = morph(
    [1, 2, 3],
    {
      value: function (value) { return value * value },
      key: function (_, key) { return lookup[key] }
    },
    {}
  )

  t.deepEqual(result1, { red: 1, white: 4, blue: 9 }, 'individual transform functions')

  const result2 = morph(
    ['orange', 'green', 'yellow'],
    function (value, key) {
      return [value, lookup[key]]
    },
    {}
  )

  t.deepEqual(result2, { red: 'orange', white: 'green', blue: 'yellow' })
  t.end()
})
