// module.exports = (fn) => (req, res, next) => {
//   // Promise.resolve(fn(req, res, next)).catch((err) => console.log(err))
//   // return next(err)
//   return Promise.resolve(fn(req, res, next)).catch((err) => next(err))
// }

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}

module.exports = catchAsync
