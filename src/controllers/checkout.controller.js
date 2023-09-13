'use strict'

const catchAsync = require('../middleware/catch.async')
const { OK, SuccessResponse } = require('../core/success.response')
const CheckoutService = require('../services/checkout.service')

class CheckoutController {
  checkoutReview = catchAsync(async (req, res, next) => {
    OK(
      res,
      'Create new cart success',
      await CheckoutService.checkoutReview(req.body),
    )
  })
}

module.exports = new CheckoutController()
