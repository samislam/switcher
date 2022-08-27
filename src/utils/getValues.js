/*=============================================
=            importing dependencies            =
=============================================*/
const checkTypes = require('@samislam/checktypes')

/*=====  End of importing dependencies  ======*/

async function getKey(key, req, res) {
  let userKey
  if (checkTypes.isString(key)) userKey = key
  if (checkTypes.isAsycOrSyncFunc(key)) userKey = await key(req, res)
  return userKey
}
async function getMiddlewareStacks(key, middlewareStacks, options, req, res, next) {
  let userMiddlewareStacksValue
  if (checkTypes.isObject(middlewareStacks) && checkTypes.isString(key)) {
    userMiddlewareStacksValue = middlewareStacks[key]
    if (!userMiddlewareStacksValue) {
      const delimiterKey = '%$switch%'
      for (const propKey of Object.keys(middlewareStacks)) {
        const multiKeysSet = propKey.split(delimiterKey)
        if (multiKeysSet.includes(key)) userMiddlewareStacksValue = middlewareStacks[propKey]
      }
    }
    if (!userMiddlewareStacksValue) userMiddlewareStacksValue = middlewareStacks[options.elseKeyword]
    if (!userMiddlewareStacksValue) userMiddlewareStacksValue = (req, res, next) => next()
  }
  if (checkTypes.isAsycOrSyncFunc(middlewareStacks)) userMiddlewareStacksValue = await middlewareStacks(key, req, res, next)
  return userMiddlewareStacksValue
}

const getValue = async (parameter, ...args) => (checkTypes.isAsycOrSyncFunc(parameter) ? await parameter(...args) : parameter)

/*----------  end of code, exporting  ----------*/
module.exports = {
  getKey,
  getMiddlewareStacks,
  getValue,
}
