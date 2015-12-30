var done = require('./done')

module.exports = getStep

function getStep (type) {
  if (Array.isArray(type)) {
    return arrayStep
  }
  if (typeof type === 'string' || typeof type === 'number') {
    return addStep
  }
  if (typeof type.size !== 'undefined') {
    if (typeof type.add === 'function') {
      return setStep
    }
    if (typeof type.set === 'function') {
      return mapStep
    }
  }
  return objectStep
}

function objectStep (acc, value, key) {
  if (done(acc, value, key)) {
    return acc
  }
  acc[key] = value
  return acc
}

function setStep (acc, value, key) {
  if (done(acc, value, key)) {
    return acc
  }
  acc.add(value)
  return acc
}

function mapStep (acc, value, key) {
  if (done(acc, value, key)) {
    return acc
  }
  acc.set(key, value)
  return acc
}

function arrayStep (acc, value, key) {
  if (done(acc, value, key)) {
    return acc
  }
  acc.push(value)
  return acc
}

function addStep (acc, value, key) {
  if (done(acc, value, key)) {
    return acc
  }
  return acc + value
}
