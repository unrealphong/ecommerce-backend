'use strict'
const mongoose = require('mongoose')

const connectString = 'mongodb://localhost:27017/ecommerce'

class Database {
  constructor() {
    this.connect()
  }

  // connect

  connect(type = 'mongodb') {
    if (type === 'mongodb') {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }

    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then((_) => console.log('Database connected'))

      .catch((err) => {
        console.log('Database connection error')
        console.log(err)
      })
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb
