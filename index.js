/*=============================================
=            importing dependencies            =
=============================================*/
const checkTypes = require('@samislam/checktypes')
/*=====  End of importing dependencies  ======*/

function getKey(key, req, res) {
  let userKey
  if (checkTypes.isString(key)) userKey = key
  if (checkTypes.isAsycOrSyncFunc(key)) userKey = key(req, res)
  return userKey
}
function getMiddlewareStacks(middlewareStacks, userKey, req, res, next) {
  let userMiddlewareStacks
  if (checkTypes.isObject(middlewareStacks)) userMiddlewareStacks = middlewareStacks[userKey]
  if (checkTypes.isAsycOrSyncFunc(middlewareStacks)) userMiddlewareStacks = middlewareStacks(userKey, req, res, next)
  return userMiddlewareStacks
}

function switcher(key, middlewareStacks) {
  return async (req, res, next) => {
    let userKey, userMiddlewareStacks
    // getting the key & middlewareStacks values ---------------
    // &@overload: (key: string | function, middlewareStacks: object | function)
    if (middlewareStacks) {
      userKey = getKey(key, req, res)
      userMiddlewareStacks = getMiddlewareStacks(middlewareStacks, userKey, req, res, next)
    }
    // &@overload: (key: function)
    else userMiddlewareStacks = key(req, res, next)

    // &@userMiddlewareStacks: function | [function]
    // execute based on the return values ---------------
    if (checkTypes.isAsycOrSyncFunc(userMiddlewareStacks)) await userMiddlewareStacks(req, res, next)
    if (checkTypes.isArray(userMiddlewareStacks)) {
      let innerNextCalled = false
      const innerNext = (error) => {
        innerNextCalled = true
        if (error) next(error)
      }
      let i = 1 // init
      for (const middleware of userMiddlewareStacks) {
        innerNextCalled = false // reset
        await middleware(req, res, userMiddlewareStacks.length !== i ? innerNext : next) // give next or innerNext
        if (!innerNextCalled) break // break if innerNext wasn't called
        i++
      }
    }
  }
}

/*----------  end of code, exporting  ----------*/
module.exports = switcher
