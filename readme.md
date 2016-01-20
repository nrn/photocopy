# photocopy

A weird little iteration library.

`npm install photocopy`

After the readme, check out the usage examples in the [x folder](x)!

## copy = photocopy(original[, transform[, seed[, collect]]])

`original` is the collection to iterate over.

`transform` is a function that takes the next step in a process, and
returns a reducing function. That reducing function is called
once per step, and calls the next step in the process 0 or more times.
Defaults to the identity transform.

`seed` is the value to reduce into.  By default we try to build a seed
the same type as original with `new original.constructor`, if that
doesn't exist we use a standard object.

`collect` is the final step in the process, which puts new values into
the accumulated value. Defaults to trying to match something compatible
with the seed value (even if seed itself was defaulted). Falls back to
generically adding properties to the seed.

## transforms

### pc.map(fn)

Takes a function that gets (value, key), and returns the new value.

### pc.keyMap(fn)

Takes a function that gets (value, key), and returns the new key.

### pc.filter(fn)

Takes a function that gets (value, key), and returns truthy to keep, falsy
to skip.

### pc.take(num)

Take the first `num` items.

### pc.skip(num)

Skip the first `num` items.

### pc.cat

Unwraps collections into their individual values/keys.

### pc.steamroll

Recursively unwraps nested collections into their leaf node values/keys.

### pc.identity

Passes things through unchanged.

## Utilities

### pc.byKey

A collecting function that creates arrays of values, stored
by key on an object.

### comp(fn0[, fn1[,...fnN]]) // takes any number of functions

Compose transforms together, to be run in order left to right on
each item.

### simple(fn)

The easiest way to make a simple transform creator. Takes a function
that will be called with (f, next, acc, val, key), and returns a
function that should be called with the 'f' value. Should apply f and
next in various ways to acc, val, and key.

### done(acc, value, key)

Test to see if acc is reduced, or value and key are both undefined.
Useful to know if the transducing process is done.

### reduced(final)

When you want to fast track processing to the end, return reduced(final)
from any step in the process, and final will be returned as the final
product. No more steps are iterated. Do not pass go, do not collect
$200.

## example

```javascript

var pc = require('photocopy')

// shallow copy
var copyOfA = pc({ a: 1, b: 2 })

// map/forEach
var squaredArray = pc([ 3, 4, 5 ], pc.map(function (val) { return val * val }))

// array-like to array
var args
;(function () {
  args = pc(arguments, pc.identity, [])
})(1, 2, 3)

// transformed copy

function Dog () { this.says = 'bark'; this.weight = 45; this.name = 'foo' }

var intenseDog = pc(new Dog(), pc.map(transform))
intenseDog instanceof Dog // true

function transform (val, key) {
  if (key === 'name') return 'bar'
  return val + val
}

console.log(copyOfA, squaredArray, args, intenseDog)

```

## History

This library evolved from only being able to run a map on an object, to
applying arbitrary transformations to any collection. It is largely
inspired by transducers, but doesn't interoperate with other JS transducer
libraries. The biggest reason is that photocopy supports keys as an extra
argument, instead of wrapping some collections in [ key, value ] arrays. It
also works as variable argument functions, instead of making the initialized
transducers objects with weird private properties. Does not support arity
0 to get a seed value from a step function.

Also the top level API feels a lot more comfortable to me, and we don't provide
a lot of uncommonly used transforms, instead leaving you the fun of
implementing them for yourself.

## License: ISC

Copyright 2016 Nick Niemeir <nick.niemeir@gmail.com>

