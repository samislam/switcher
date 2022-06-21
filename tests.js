/*=============================================
=            importing dependencies            =
=============================================*/
const express = require("express");
const log = require("@samislam/log");

/*=============================================
=            importing modules            =
=============================================*/

const switcher = require("./index");
/*=====  End of importing dependencies  ======*/

/*=============================================
=            pre-defined Middlewares            =
=============================================*/
const newLineMiddleware = (req, res, next) => {
  log("------------------------------");
  next();
};
const sendResMiddleware = (req, res, next) => {
  log.success("someMiddleware ran");
  res.end();
  next();
};

const setUser = (req, res, next) => {
  req.$loggedInUser = "admin";
  next();
};
/*=====  End of pre-defined Middlewares  ======*/

const app = express();

// ^ test #1
// ? uncomment the following code block to test

// app.route('/api').get(
//   newLineMiddleware,
//   setUser,
//   switcher('market', {
//     admin: [
//       (req, res, next) => {
//         log.i('/api -> switcher -> admin middleware #1')
//         next()
//       },
//       (req, res, next) => {
//         log.i('/api -> switcher -> admin middleware #2')
//         next()
//       },
//       (req, res, next) => {
//         log.i('/api -> switcher -> admin middleware #3')
//         log(next)
//         next()
//       },
//     ],
//     market: [
//       (req, res, next) => {
//         log.i('/api -> switcher -> market middleware #1')
//         next()
//       },
//       (req, res, next) => {
//         log.i('/api -> switcher -> market middleware #1')
//         next()
//       },
//       (req, res, next) => {
//         log.i('/api -> switcher -> market middleware #1')
//         next()
//       },
//     ],
//   }),
//   sendResMiddleware
// )

// ^ test #2
// ? uncomment the following code block to test

// app.route('/api').get(
//   newLineMiddleware,
//   setUser,
//   switcher((req) => req.$loggedInUser, {
//     admin: [
//       (req, res, next) => {
//         log.i('/api -> switcher -> admin middleware #1')
//         next()
//       },
//       (req, res, next) => {
//         log.i('/api -> switcher -> admin middleware #2')
//         next()
//       },
//       (req, res, next) => {
//         log.i('/api -> switcher -> admin middleware #3')
//         next()
//       },
//     ],
//     market: [
//       (req, res, next) => {
//         log.i('/api -> switcher -> market middleware #1')
//         next()
//       },
//       (req, res, next) => {
//         log.i('/api -> switcher -> market middleware #1')
//         next()
//       },
//       (req, res, next) => {
//         log.i('/api -> switcher -> market middleware #1')
//         next()
//       },
//     ],
//   }),
//   sendResMiddleware
// )

// ^ test #3
// ? uncomment the following code block to test

// app.route('/api').get(
//   newLineMiddleware,
//   setUser,
//   switcher('admin', (key, req, res, next) => {
//     if (key == 'admin')
//       return [
//         (req, res, next) => {
//           log.i('/api -> switcher -> admin middleware #1')
//           next()
//         },
//         (req, res, next) => {
//           log.i('/api -> switcher -> admin middleware #2')
//           next()
//         },
//         (req, res, next) => {
//           log.i('/api -> switcher -> admin middleware #3')
//           next()
//         },
//       ]
//     if (key == 'market')
//       return [
//         (req, res, next) => {
//           log.i('/api -> switcher -> market middleware #1')
//           next()
//         },
//         (req, res, next) => {
//           log.i('/api -> switcher -> market middleware #2')
//           next()
//         },
//         (req, res, next) => {
//           log.i('/api -> switcher -> market middleware #3')
//           next()
//         },
//       ]
//   }),
//   sendResMiddleware
// )

// ^ test #4
// ? uncomment the following code block to test

// app.route('/api').get(
//   newLineMiddleware,
//   setUser,
//   switcher(
//     (req) => req.$loggedInUser,
//     (key, req, res, next) => {
//       if (key == 'admin')
//         return [
//           (req, res, next) => {
//             log.i('/api -> switcher -> admin middleware #1')
//             next()
//           },
//           (req, res, next) => {
//             log.i('/api -> switcher -> admin middleware #2')
//             next()
//           },
//           (req, res, next) => {
//             log.i('/api -> switcher -> admin middleware #3')
//             next()
//           },
//         ]
//       if (key == 'market')
//         return [
//           (req, res, next) => {
//             log.i('/api -> switcher -> market middleware #1')
//             next()
//           },
//           (req, res, next) => {
//             log.i('/api -> switcher -> market middleware #2')
//             next()
//           },
//           (req, res, next) => {
//             log.i('/api -> switcher -> market middleware #3')
//             next()
//           },
//         ]
//     }
//   ),
//   sendResMiddleware
// )

// ^ test #5
// ? uncomment the following code block to test

// app.route('/api').get(
//   newLineMiddleware,
//   setUser,
//   switcher((req, res, next) => {
//     if (req.$loggedInUser == 'admin')
//       return [
//         (req, res, next) => {
//           log.i('/api -> switcher -> admin middleware #1')
//           next()
//         },
//         (req, res, next) => {
//           log.i('/api -> switcher -> admin middleware #2')
//           next()
//         },
//         (req, res, next) => {
//           log.i('/api -> switcher -> admin middleware #3')
//           next()
//         },
//       ]
//     if (req.$loggedInUser == 'market')
//       return [
//         (req, res, next) => {
//           log.i('/api -> switcher -> market middleware #1')
//           next()
//         },
//         (req, res, next) => {
//           log.i('/api -> switcher -> market middleware #2')
//           next()
//         },
//         (req, res, next) => {
//           log.i('/api -> switcher -> market middleware #3')
//           next()
//         },
//       ]
//     next()
//   }),
//   sendResMiddleware
// )

// ^ test #6
// ? uncomment the following code block to test

// app.route('/api').get(
//   newLineMiddleware,
//   setUser,
//   switcher((req) => req.$loggedInUser, {
//     admin: (req, res, next) => {
//       log.i('/api -> switcher -> admin functional middleware')
//       next()
//     },
//     market: [
//       (req, res, next) => {
//         log.i('/api -> switcher -> market middleware #1')
//         next()
//       },
//       (req, res, next) => {
//         log.i('/api -> switcher -> market middleware #1')
//         next()
//       },
//     ],
//   }),
//   sendResMiddleware
// )

// ^ test #7
// ? uncomment the following code block to test

// app.route("/api").get(
//   newLineMiddleware,
//   setUser,
//   switcher((req, res, next) => {
//     if (req.$loggedInUser == "admin")
//       return (req, res, next) => {
//         log.i("/api -> switcher -> admin functional middleware");
//         next();
//       };

//     if (req.$loggedInUser == "market")
//       return (req, res, next) => {
//         log.i("/api -> switcher -> market functional middleware");
//         next();
//       };
//     next();
//   }),
//   sendResMiddleware
// );

console.clear();
app.listen(8921, () => log.info(log.label, "test listening on port 8921"));
