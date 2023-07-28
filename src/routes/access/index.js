const { Router } = require('express')
const accessController = require('../../controllers/access.controller')
const { authentication } = require('../../auth/authUtils')

const router = Router()
router.post('/shop/signup', accessController.signUp)
router.post('/shop/login', accessController.login)

// authentication
router.use(authentication)

router.post('/shop/logout', accessController.logout)

module.exports = router
