'use strict'

const catchAsync = require('../middleware/catch.async')
const { OK, SuccessResponse } = require('../core/success.response')
const DiscountService = require('../services/discount.service')

class DiscountController {
  createDiscountCode = catchAsync(async (req, res) => {
    OK(
      res,
      'Create discount success',
      await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    )
  })

  updateDiscountCode = catchAsync(async (req, res) => {
    OK(
      res,
      'Update discount success',
      await DiscountService.updateDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    )
  })

  // getAllDiscountCodeWithProduct = catchAsync(async (req, res) => {
  //   OK(
  //     res,
  //     'Get Discount Code success',
  //     DiscountService.getAllDiscountCodesWithProduct({
  //       ...req.query,
  //     }),
  //   )
  // })
  getAllDiscountCodeWithProduct = catchAsync(async (req, res) => {
    new SuccessResponse({
      message: 'Get Discount Code success',
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query,
      }),
    }).send(res)
  })

  getAllDiscountCodesByShop = catchAsync(async (req, res) => {
    OK(
      res,
      'Get all discount codes success',
      await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    )
  })

  getDiscountAmount = catchAsync(async (req, res) => {
    OK(
      res,
      'Get discount amount success',
      await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    )
  })

  deleteDiscountCode = catchAsync(async (req, res) => {
    OK(
      res,
      'Delete discount success',
      await DiscountService.deleteDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    )
  })

  cancelDiscountCode = catchAsync(async (req, res) => {
    OK(
      res,
      'Cancel discount success',
      await DiscountService.cancelDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    )
  })
}

module.exports = new DiscountController()
