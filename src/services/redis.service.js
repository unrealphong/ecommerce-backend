'use strict'
const redis = require('redis')

const redisClient = redis.createClient()
const { promisify } = require('util')

const pexpire = promisify(redisClient.pExpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setNX).bind(redisClient)

const acquireLook = async (productId, quantity, cartId) => {
  // const key
}
