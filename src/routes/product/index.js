const { Router } = require('express')
const { authentication, authenticationV2 } = require('../../auth/authUtils')
const productController = require('../../controllers/product.controller')

const router = Router()

// authentication
router.use(authenticationV2)

router.post('', productController.createProduct)

module.exports = router
