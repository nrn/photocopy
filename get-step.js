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
  acc[key] = value
  return acc
}

function setStep (acc, value, key) {
  acc.add(value)
  return acc
}

function mapStep (acc, value, key) {
  acc.set(key, value)
  return acc
}

function arrayStep (acc, value, key) {
  acc.push(value)
  return acc
}

function addStep (acc, value, key) {
  return acc + value
}
