'use strict'

const keytokenModel = require('../models/keytoken.model')

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey }) => {
    try {
      //   const publicKeyString = publicKey.toString()
      const tokens = keytokenModel.create({
        user: userId,
        // publicKey: publicKeyString,
        privateKey,
        publicKey,
      })
      return tokens ? publicKeyString : null
    } catch (error) {
      return error.message
    }
  }
}

module.exports = KeyTokenService
