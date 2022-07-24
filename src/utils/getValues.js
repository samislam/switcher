async function getKey(key, req, res) {
  let userKey
  if (checkTypes.isString(key)) userKey = key
  if (checkTypes.isAsycOrSyncFunc(key)) userKey = await key(req, res)
  return userKey
}
async function getMiddlewareStacks(key, middlewareStacks, options, req, res, next) {
  let userMiddlewareStacksValue
  if (checkTypes.isObject(middlewareStacks)) {
    userMiddlewareStacksValue = middlewareStacks[key] || middlewareStacks[options.elseKeyword]
    if (checkTypes.isUndefined(userMiddlewareStacksValue)) userMiddlewareStacksValue = (req, res, next) => next()
  }
  if (checkTypes.isAsycOrSyncFunc(middlewareStacks)) userMiddlewareStacksValue = await middlewareStacks(key, req, res, next)
  return userMiddlewareStacksValue
}

const getValue = async (parameter, ...args) => (checkTypes.isAsycOrSyncFunc(parameter) ? await parameter(...args) : parameter)

module.exports = {
  getKey,
  getMiddlewareStacks,
  getValue,
}
