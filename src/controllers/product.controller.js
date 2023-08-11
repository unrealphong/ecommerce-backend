'use strict'

const { SuccessResponse } = require('../core/success.response')
const catchAsync = require('../middleware/catch.async')
const ProductService = require('../services/product.service')

class ProductController {
  createProduct = catchAsync(async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new Product success!',
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res)
  })

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'publishProductByShop success!',
      metadata: await ProductService.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res)
  }
  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'unPublishProductByShop success!',
      metadata: await ProductService.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res)
  }

  /**
   * @description Get all Draft for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}}
   */
  getAllDraftsForShop = catchAsync(async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list Draft success!',
      metadata: await ProductService.findAllDraftForShop({
        product_shop: req.user.userId,
      }),
    }).send(res)
  })

  getAllPublishForShop = catchAsync(async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list Publish success!',
      metadata: await ProductService.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res)
  })

  getListSearchProduct = catchAsync(async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list getListSearchProduct success!',
      metadata: await ProductService.searchProducts(req.params),
    }).send(res)
  })
}
module.exports = new ProductController()
