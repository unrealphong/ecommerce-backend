'use strict'

const catchAsync = require('../middleware/catch.async')
const { OK, SuccessResponse } = require('../core/success.response')
const CartService = require('../services/cart.service')

class CartController {
  /**
   * @desc add to cart
   * @param {int} userId
   * @param {*} res
   * @param {*} next
   * @url /v1/api/cart/user
   * @return {}
   */
  addToCart = catchAsync(async (req, res, next) => {
    OK(res, 'Create new cart success', await CartService.addToCart(req.body))
  })
  update = catchAsync(async (req, res, next) => {
    OK(res, 'Update cart success', await CartService.addToCartV2(req.body))
  })
  delete = catchAsync(async (req, res, next) => {
    OK(res, 'Delete cart success', await CartService.deleteUserCart(req.body))
  })
  listToCart = catchAsync(async (req, res, next) => {
    OK(res, 'List cart success', await CartService.getListUserCart(req.query))
  })
}

module.exports = new CartController()
