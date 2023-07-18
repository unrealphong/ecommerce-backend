'use strict'

const mongoose = require('mongoose')
const os = require('os')
const _seconds = 10000
// count connect
const countConnect = () => {
  const numConnect = mongoose.connections.length
  console.log(`Number of connections: ${numConnect}`)
}

const checkOverload = () => {
  setInterval(() => {
    const numConnections = mongoose.connections.length
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss
    const maxConnections = numCores * 5
    console.log(`Active connections ${numConnections}`)
    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`)

    if (numConnections > maxConnections) {
      console.log('Connection overload detected')
    }
  }, _seconds)
}

module.exports = {
  countConnect,
  checkOverload,
}
