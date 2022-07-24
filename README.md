Switcher is a small powerful express middleware that allows for switching between different middleware stacks.

# Examples:

### Example #1

### `@overload: switcher(key: string | function, middlewareStacks: object | function)`

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

### Example #2:

### `@overload: switcher(key: function)`

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

### Example #3:

```js
// @overload: switcher(key: string | function, middlewareStacks: object | function, options: object | function)
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

// @overload: switcher(key: string | function, middlewareStacks: object | function, options: object | function)
// or as a nice fully-featured valid JavaScript syntax
switcher((req) => req.$loggedInUser, (key, req, res, next)=>({
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
}[key]))
```

# API reference:

The switcher middleware function comes with two overloads:

# `@overload switcher(key: string | function, middlewareStacks: object | function, options: object | function)`: Express middleware

This overload is useful when you have a primitive that you're using to decide which track of stacks to walk on. And in case the middlewareStacks argument was an object, the **key** is used internally by switcher to *switch* or to *choose* the object property you define which matches the provided key.

<ins>parameters:</ins>

- **key**: string | function, whatever you provide here is going be passed and used to the *middlewareStacks* argument as the first argument.
    
    - If a function is provided, it will be called with the express (req, res) objects.
- **middlewareStacks**: object | function, the middleware stacks to execute.
    
    - If you provided an object, the `key` argument value is going to be used as an accessor on your object, in other words, your object is going to get called by switcher as `yourObject[key]`, what you should have in this object is key/value pairs, the value of each key in this object can either be an express middleware or an array of express middlewares. whatever the key matches in your object map, is going to be the middleware-stack to use on the request.
        - if no key in your object matched the `key` argument value, `next()` is going to be called automatically, and the request is going to get handled from `switcher` back to the express middlewares stack executor.
            - If you want to capture these requests, add the key `else` to your object, and whenever a request comes and the key does not match any of your object's keys, this object property is going to be the middleware stack to use.
            - **switcher only calls next when you use an object in place of the argument middlewareStacks without having the `else` property defined in your object**.
    - If a function is provided, it will be called with (key, req, res, next), and your function can either return an express middleware or an array of express middlewares, whatever you return from this function will be the middleware-stack to use on the request.
- **options**: object | function, options to configure how swticher works.
    
    - **elseKeyword**: *string*, the keyword marked as the *else*, whenever the key does not match any of the properties in your object (the middlewareStacks argument), the property name here is going to get used instead of the key value to access the middleware stack in your object (default **else**).

# `@overload switcher(key: function)`: Express middleware

This overload is useful when you don't need that style of key, perhaps you have multiple criterias that you decide based-upon which middleware stack track to walk the request on.

<ins>parameters:</ins>

- **key**: *function*, a function that returns either return an express middleware or an array of express middlewares, whatever you return from this function will be the middleware-stack to use on the request.
    - Your function will be called with the express objects (req, res, next).

# The Behavior of Next()

- Switcher **Does Not** call **next()** internally, you always have to call next, **switcher only calls next when you use an object in place of the argument middlewareStacks without having the `else` property defined in your object**.
    
- In case a middleware called `next()`, it'll move to the next middleware in the array you provide, in case you provided a middleware instead of an array of middlewares, or in case it reached the last middleware in the array, the argument `next` that switcher passes to your middleware will move to the outer middleware (it will go back to the express middleware stack).
    
- When you write a middlewares container function style (**middlewareStacks** in case of the first overload, **key** in the case of the second overload), if you reached the point where you want to move the request out of the **switcher** middleware completely (you want to exit from switcher), you can **only** do one of the following:
    
    1.  call `next()` at the end of the function.
        
    2.  call `next()` inside your last middleware in case your return value of the function was an array of middlewares.
        
    3.  inside your function in case your return value was a function.
        

### For example:

```js
// @overload: switcher(key: string | function, middlewareStacks: object | function, options: object | function)
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
        next() // this next will move out of switcher to otherMiddlewareXXYY
      },
    ],
  }),
  otherMiddlewareXXYY,
  someOtherMiddleware(x, y, z)
)
// @overload: switcher(key: function)
.post(switcher((req, res, next) => {
  if (req.$loggedInUser == 'admin')
    return (req, res, next) => {
      next() // this next will move out of switcher to otherMiddlewareXXYY
    }

  if (req.$loggedInUser == 'market')
    return (req, res, next) => {
      next() // this next will move out of switcher to otherMiddlewareXXYY
    }
  // in case req.$loggedInUser was non of 'admin' or 'market',
  next() // this next will move out of switcher to otherMiddlewareXXYY
}), otherMiddlewareXXYY)
```

> **Tip 💡**:
> 
> In case you did not understand this section, don't worry, all the information mentioned here is just to revise how the switcher logic works in any code, you don't have to think about any of that while writing your code, since you'll always return something at the end, no changes you'll ever have to make in your code. The code you write will naturally work without any two `next()` calls in your code.

# FAQ:

**Q:** Why is my request hanging in switcher and not moving to the next middleware?

- The reason must be in a next call, think of the place next is not being called.

* * *

Originally created at: **21 June 2022**.