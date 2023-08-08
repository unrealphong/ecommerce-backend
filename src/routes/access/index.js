const { Router } = require('express')
const accessController = require('../../controllers/access.controller')
const { authentication, authenticationV2 } = require('../../auth/authUtils')

const router = Router()
router.post('/shop/signup', accessController.signUp)
router.post('/shop/login', accessController.login)

// authentication
router.use(authenticationV2)

router.post('/shop/logout', accessController.logout)
router.post('/shop/refresh-token', accessController.handlerRefreshToken)
module.exports = router
