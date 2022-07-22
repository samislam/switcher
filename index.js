/*=============================================
=            importing dependencies            =
=============================================*/
const checkTypes = require('@samislam/checktypes')
/*=====  End of importing dependencies  ======*/
const _ = require('lodash')

async function getKey(key, req, res) {
  let userKey
  if (checkTypes.isString(key)) userKey = key
  if (checkTypes.isAsycOrSyncFunc(key)) userKey = await key(req, res)
  return userKey
}
async function getMiddlewareStacks(key, middlewareStacks, options, req, res, next) {
  let userMiddlewareStacks
  if (checkTypes.isObject(middlewareStacks)) {
    userMiddlewareStacks = middlewareStacks[key] || middlewareStacks[options.elseKeyword]
    if (checkTypes.isUndefined(userMiddlewareStacks) && options.elseDefaults) userMiddlewareStacks = (req, res, next) => next()
  }

  if (checkTypes.isAsycOrSyncFunc(middlewareStacks)) userMiddlewareStacks = await middlewareStacks(key, req, res, next)
  return userMiddlewareStacks
}

const getValue = async (parameter, ...args) => (checkTypes.isAsycOrSyncFunc(parameter) ? await parameter(...args) : parameter)

function switcher(key, middlewareStacks, options) {
  return async (req, res, next) => {
    let keyValue, middlewareStacksValue
    // getting the key & middlewareStacks values ---------------
    // &@overload: (key: string | function, middlewareStacks: object | function, options: object | function)
    if (middlewareStacks) {
      keyValue = await getKey(key, req, res)
      const optionsValue = await getValue(options, req)
      const chosenOptions = {}
      const defaultOptions = {
        elseKeyword: 'else',
        elseDefaults: true,
      }
      _.merge(chosenOptions, defaultOptions, optionsValue)
      middlewareStacksValue = await getMiddlewareStacks(keyValue, middlewareStacks, chosenOptions, req, res, next)
    }
    // &@overload: (key: function)
    else middlewareStacksValue = await key(req, res, next)

    // &@userMiddlewareStacks: function | [function]
    // execute based on the return values ---------------
    if (checkTypes.isAsycOrSyncFunc(middlewareStacksValue)) await middlewareStacksValue(req, res, next)
    if (checkTypes.isArray(middlewareStacksValue)) {
      let innerNextCalled = false
      let globalError = false
      const innerNext = (error) => {
        innerNextCalled = true
        if (error) {
          next(error)
          globalError = true
        }
      }
      let i = 1 // init
      for (const middleware of middlewareStacksValue) {
        innerNextCalled = false // reset
        await middleware(req, res, middlewareStacksValue.length !== i ? innerNext : next) // give next or innerNext
        if (!innerNextCalled || globalError) break // break if innerNext wasn't called
        i++
      }
    }
  }
}

/*----------  end of code, exporting  ----------*/
module.exports = switcher
