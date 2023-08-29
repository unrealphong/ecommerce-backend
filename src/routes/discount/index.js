const { Router } = require('express')
const { authentication, authenticationV2 } = require('../../auth/authUtils')
const discountController = require('../../controllers/discount.controller')

const router = Router()

router.post('/amount', discountController.getDiscountAmount)
router.get(
  '/list_product_code',
  discountController.getAllDiscountCodeWithProduct,
)

// authentication
router.use(authenticationV2)

router.post('', discountController.createDiscountCode)
router.get('', discountController.getAllDiscountCodesByShop)

module.exports = router
