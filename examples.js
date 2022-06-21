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

// from all the above, the return values of middlewareStacks can be either (a middleware function) or (an array of middleware functions), ex:

// overload #1 example
switcher((req) => req.$loggedInUser, {
  admin: (req, res, next) => {
    next()
  },
  market: (req, res, next) => {
    next()
  },
})
// overload #2 example
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
