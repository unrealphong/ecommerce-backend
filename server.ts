import app from '@/app'

const server = app.listen(3000, () => {
  console.log(`WSV running port ${3000}`)
})

process.on('SIGINT', () => {
  console.log('\nClosing server and exiting...')
  server.close(() => {
    console.log('Server closed.')
    process.exit(0)
  })
})
