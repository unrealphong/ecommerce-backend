'use strict'
const shopModel = require('../models/shop.model')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
}

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      const holderShop = await shopModel.findOne({ email }).lean()
      if (holderShop) {
        return {
          code: 'xxx',
          message: 'Shop already registered',
        }
      }
      const passwordHash = await bcrypt.hash(password, 10)
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      })
      if (newShop) {
        // created privateKey, publicKey
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
          modulusLength: 4096,
        })
        console.log({ privateKey, publicKey })
      }

      return {
        shop: newShop,
      }
    } catch (error) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error',
      }
    }
  }
}

module.exports = AccessService
