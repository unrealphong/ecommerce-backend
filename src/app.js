const express = require('express')
const morgan = require('morgan')
const { default: helmet } = require('helmet')
const compression = require('compression')
const app = express()

// init middleware
app.use(morgan('dev'))
// app.use(morgan('common'))
// app.use(morgan("combined"));
// app.use(morgan("short"));
// app.use(morgan("tiny"));
app.use(helmet())
app.use(compression())
app.use(express.json({ limit: '10kb' }))
app.use(
  express.urlencoded({
    extended: true,
  }),
)
// init db
require('./configs/config.mongoose')
// const { checkOverload } = require('./helpers/check.connect')
// checkOverload()

// init router
app.use('', require('./routes'))

// handle error
app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  const statusCode = error.status || 500
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    // stack: error.stack,
    message: error.message || 'Internal Server Error',
  })
})

module.exports = app
