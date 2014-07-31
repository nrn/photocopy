# photocopy

Create a shallow copy of an object or array, optionally providing a function
to modify each property as they are copied.

`npm install photocopy`

## copy = photocopy(original[, modifier[, paper]])

original is the object to copy properties off of.

modifier is an optional function to map over the
properties. Return the value for the copied object.
Called with (value, key). Defaults to the identity function.

paper is the optional object to copy properties onto.
If not specified we try to build an object with
`new original.constructor`, if that doesn't exist we use
`new Object`.

## example

```javascript

var photocopy = require('photocopy')

// shallow copy
var copyOfA = photocopy({ a: 1, b: 2 })

// map/forEach
var squaredArray = photocopy([ 3, 4, 5 ], function (val) { return val * val })

// array-like to array
var args
;(function () {
  args = photocopy(arguments, null, [])
})(1, 2, 3)

// transformed copy

function Dog () { this.says = 'bark'; this.weight = 45; this.name = 'foo';}

var intenseDog = photocopy(new Dog (), transform)
intenseDog instanceof Dog // true

function transform (val, key) {
  if (key === 'name') return 'bar'
  return val + val
}

console.log(copyOfA, squaredArray, args, intenseDog)

```

