'use strict'

const keytokenModel = require('../models/keytoken.model')
const { Types } = require('mongoose')
class KeyTokenService {
  static removeKeyById = async (id) => {
    return await keytokenModel.deleteOne(id)
  }
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      //   const publicKeyString = publicKey.toString()
      // const tokens = keytokenModel.create({
      //   user: userId,
      //   // publicKey: publicKeyString,
      //   privateKey,
      //   publicKey,
      // })
      // return tokens ? token.publicKey : null
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokenUsed: [],
          refreshToken,
        },
        options = {
          upsert: true,
          new: true,
        }
      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options,
      )
      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error.message
    }
  }

  static findByUserId = async (userId) => {
    return await keytokenModel.findOne({ user: new Types.ObjectId(userId) })
  }
}

module.exports = KeyTokenService
