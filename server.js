require('dotenv').config({
  path: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
})

const PORT = process.env.PORT || 3333
const app = require('./src/app')

const server = app.listen(PORT, () => {
  console.log(`WSV eCommerce start with ${PORT}`)
})

process.on('SIGINT', () => {
  console.log('\nClosing server and exiting...')
  server.close(() => {
    console.log('Server closed.')
    process.exit(0)
  })
})
