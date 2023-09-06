const { Router } = require('express')
const { authentication, authenticationV2 } = require('../../auth/authUtils')
const CartController = require('../../controllers/cart.controller')

const router = Router()

router.post('', CartController.addToCart)
router.delete('', CartController.delete)
router.post('/update', CartController.update)
router.get('', CartController.listToCart)

module.exports = router
