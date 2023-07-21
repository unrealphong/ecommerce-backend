const jwt = require('jsonwebtoken')

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

module.exports = {
  createTokenPair,
}
