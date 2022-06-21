Switcher is a small powerful express middleware that allows for switching between different middleware stacks.

# API reference:

`switcher(key: string | function, middlewareStacks: object | function)`

The switcher middleware function comes with two overloads:

`@overload: switcher(key: string | function, middlewareStacks: object | function)`

This overload is useful when you have a primitve that you're using to decide which track of stacks to walk on. And in case the middlewareStacks argument was an object, the **key** is used internally by switcher to _switch_ or to _choose_ the object property you define which matches the provided key.

- if `key` was a function, it will be called with the express `(req, res)` objects.
- if `middlewareStacks` was a function, it will be called with the return value of argument `key`, `req`, `res`, and `next`, _i.e._ `(key, req, res, next)`.
- `middlewareStacks`: object property or function return value can be one of: _function | [function]_

`@overload: switcher(key: function)`

This overload is useful when you don't need that style of key, perhaps you have mutliple criterias that you decide based-upon which middleware stack track to walk the request on.

- the function `key` will be called with the arugments of express `(req, res, next)`
- key function return value can be one of: _function | [function]_

# Examples:

## `@overload: switcher(key: string | function, middlewareStacks: object | function)`

```js
//  key: function, middlewareStacks: object
switcher((req) => req.$loggedInUser, {
  admin: [
    (req, res, next) => {
      next()
    },
    (req, res, next) => {
      next()
    },
    (req, res, next) => {
      next()
    },
  ],
  market: [
    (req, res, next) => {
      next()
    },
    (req, res, next) => {
      next()
    },
    (req, res, next) => {
      next()
    },
  ],
})
//  key: string, middlewareStacks: object
switcher('admin', {
  admin: [
    (req, res, next) => {
      next()
    },
    (req, res, next) => {
      next()
    },
    (req, res, next) => {
      next()
    },
  ],
  market: [
    (req, res, next) => {
      next()
    },
    (req, res, next) => {
      next()
    },
    (req, res, next) => {
      next()
    },
  ],
})
//  key: function, middlewareStacks: function
switcher(
  (req) => req.$loggedInUser,
  (key, req, res, next) => {
    if (key == 'admin')
      return [
        (req, res, next) => {
          next()
        },
        (req, res, next) => {
          next()
        },
        (req, res, next) => {
          next()
        },
      ]
    if (key == 'market')
      return [
        (req, res, next) => {
          next()
        },
        (req, res, next) => {
          next()
        },
        (req, res, next) => {
          next()
        },
      ]
  }
)
//  key: string, middlewareStacks: function
switcher('admin', (key, req, res, next) => {
  if (key == 'admin')
    return [
      (req, res, next) => {
        next()
      },
      (req, res, next) => {
        next()
      },
      (req, res, next) => {
        next()
      },
    ]
  if (key == 'market')
    return [
      (req, res, next) => {
        next()
      },
      (req, res, next) => {
        next()
      },
      (req, res, next) => {
        next()
      },
    ]
})
```

## `@overload: switcher(key: function)`

```js
//  middlewareStacks: function
switcher((req, res, next) => {
  if (req.$loggedInUser == 'admin')
    return [
      (req, res, next) => {
        next()
      },
      (req, res, next) => {
        next()
      },
      (req, res, next) => {
        next()
      },
    ]
  if (req.$loggedInUser == 'market')
    return [
      (req, res, next) => {
        next()
      },
      (req, res, next) => {
        next()
      },
      (req, res, next) => {
        next()
      },
    ]
  next()
})
```

In the both overloads, the return values of the middlewares you define inside can be

- a middleware function.
- an array of middleware functions
- or a mix of both

For example:

```js
// @overload: switcher(key: string | function, middlewareStacks: object | function)
switcher((req) => req.$loggedInUser, {
  admin: (req, res, next) => {
    next()
  },
  market: [
    (req, res, next) => {
      next()
    },
    (req, res, next) => {
      next()
    },
  ],
})
// @overload: switcher(key: function)
switcher((req, res, next) => {
  if (req.$loggedInUser == 'admin')
    return (req, res, next) => {
      next()
    }

  if (req.$loggedInUser == 'market')
    return (req, res, next) => {
      next()
    }
  next()
})
```

# The Behaviour of Next()

- Switcher **Does Not** call **next()** internally, you always have to call next.

- In case a middleware called next, it'll move to the next middleware in the array you provide, in case you provided a function instead of a middlware, or in case it reached the last middleware in the array, the argument **next** that switcher passes to your middleware will move to the outer middleware (it will go back to the express middleware stack).

- When you write a middlewares container function style (**middlewareStacks** in case of the first overload, **key** in the case of the second overload), switcher is going to pass the arguments `req`, `res` and `next` to your function. In this case senario, if you reached the point where you want to move _next_ out of the switcher middleware, you can **either** call **next()** at the end of your function, or call `next()` inside your last middleware in case your return value was an array, or inside your function in case your return value was a function.
  For example:

```js
// @overload: switcher(key: string | function, middlewareStacks: object | function)
router.route('/users').get(
  switcher((req) => req.$loggedInUser, {
    admin: (req, res, next) => {
      next() // this next will move out of switcher to catchAsync
    },
    market: [
      (req, res, next) => {
        next() // this next will move to the middleware down bellow 👇
      },
      (req, res, next) => {
        next() // this next will move out of switcher to catchAsync
      },
    ],
  }),
  catchAsync(),
  otherMiddleware,
  someOtherMiddleware(x, y, z)
)
// @overload: switcher(key: function)
switcher((req, res, next) => {
  if (req.$loggedInUser == 'admin')
    return (req, res, next) => {
      next() // this next will move out of switcher to catchAsync
    }

  if (req.$loggedInUser == 'market')
    return (req, res, next) => {
      next() // this next will move out of switcher to catchAsync
    }
  // in case req.$loggedInUser was non of 'admin' or 'market',
  next() // this next will move out of switcher to catchAsync
})
```

# FAQ:

**Q:** Why is my request hanging in switcher and not moving to the next middleware?

**A:** This is because switcher does not call next internally, you have
to call next always if there was a middleware in the express stack after switcher.

-------
21 June 2022,


