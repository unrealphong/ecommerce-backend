'use strict'

const { SuccessResponse } = require('../core/success.response')
const catchAsync = require('../middleware/catch.async')
const ProductService = require('../services/product.service')

class ProductController {
  createProduct = catchAsync(async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new Product success!',
      metadata: await ProductService.createProduct(
        req.body.product_type,
        req.body,
      ),
    }).send(res)
  })
}
module.exports = new ProductController()
