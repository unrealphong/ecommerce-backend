require('dotenv').config({
  path: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
})

const app = require('./src/app')

const PORT = process.env.PORT || 3333

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
