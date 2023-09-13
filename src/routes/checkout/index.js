const checkoutController = require('../../controllers/checkout.controller')
const express = require('express')
const router = express.Router()

router.post('/review', checkoutController.checkoutReview)

module.exports = router
