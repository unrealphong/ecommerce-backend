const jwt = require('jsonwebtoken')
const catchAsync = require('../middleware/catch.async')
const KeyTokenService = require('../services/keytoken.service')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
// const { findByUserId } = require('../services/keytoken.service')
const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
}
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = await jwt.sign(payload, publicKey, {
      // algorithm: 'RS256',
      expiresIn: '2 days',
    })
    const refreshToken = await jwt.sign(payload, privateKey, {
      // algorithm: 'RS256',
      expiresIn: '7 days',
    })

    // verify
    jwt.verify(accessToken, publicKey, (error, decode) => {
      if (error) {
        console.log(`error verify::`, error)
      } else {
        console.log(`decode verify::`, decode)
      }
    })
    return { accessToken, refreshToken }
  } catch (error) {
    return error.message
  }
}

const authentication = catchAsync(async (req, res, next) => {
  /**
   * 1. Check userId missing?
   * 2. get accessToken
   * 3. verify token
   * 4. check user in bds?
   * 5. check keyStore with userId?
   * 6. ok all => return next()
   */

  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new AuthFailureError('1')
  const keyStore = await KeyTokenService.findByUserId(userId)
  if (!keyStore) throw new NotFoundError('2')
  const accessToken = req.headers[HEADER.AUTHORIZATION]
  console.log(accessToken)
  if (!accessToken) throw new AuthFailureError('3')

  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey)

    if (userId !== decodeUser.userId) throw new AuthFailureError('4')
    req.keyStore = keyStore
    return next()
  } catch (error) {
    throw error
  }
})

module.exports = {
  createTokenPair,
  authentication,
}
