const checkTypes = require('@samislam/checktypes')

function multiKey(...rest) {
  let keysValue
  if (rest.length === 1 && checkTypes.isArray(rest[0])) keysValue = rest[0] // expected to be an array
  else keysValue = rest
  return keysValue.join('%$switch%')
}

module.exports = multiKey
