'use strict'

const { BadRequestError } = require('../core/error.response')
const { product, clothing, electronic } = require('../models/product.model')
const { insertInventory } = require('../models/repositories/inventory.repo')
const {
  findAllDraftForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
} = require('../models/repositories/product.repo')
const { removeUndefinedObject, updateNestedObject } = require('../utils')

class productFactory {
  static productRegistry = {} // key class

  static registerProductType(type, classRef) {
    productFactory.productRegistry[type] = classRef
  }

  static async createProduct(type, payload) {
    const productClass = productFactory.productRegistry[type]
    if (!productClass) throw new BadRequestError(`Invalid Product Type ${type}`)

    return await new productClass(payload).createProduct()
  }

  static async updateProduct(type, product_id, payload) {
    const productClass = productFactory.productRegistry[type]
    if (!productClass) throw new BadRequestError(`Invalid Product Type ${type}`)
    return await new productClass(payload).updateProduct(product_id)
  }
  /**
   * @query
   */
  static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true }
    return await findAllDraftForShop({ query, limit, skip })
  }
  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true }
    return await findAllPublishForShop({ query, limit, skip })
  }

  /**
   * @put
   */
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id })
  }
  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id })
  }

  static async searchProducts({ keySearch }) {
    return await searchProductByUser({ keySearch })
  }
  static async findAllProducts({
    limit = 50,
    sort = 'ctime',
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ['product_name', 'product_thumb', 'product_price'],
    })
  }

  static async findProductById({ product_id }) {
    return await findProduct({ product_id, unSelect: ['__v'] })
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_price,
    product_description,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_price = product_price
    this.product_description = product_description
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_attributes = product_attributes
    this.product_shop = product_shop
  }

  async createProduct(product_id) {
    const newProduct = await product.create({ ...this, _id: product_id })
    if (newProduct) {
      await insertInventory({
        productId: newProduct._id,
        shopId: newProduct.product_shop,
        stock: newProduct.product_quantity,
      })
    }
    return newProduct
  }

  async updateProduct(product_id, payload) {
    return await updateProductById({ product_id, payload, model: product })
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes)
    if (!newClothing) throw new BadRequestError('create new clothing error')

    const newProduct = super.createProduct()
    if (!newProduct) throw new BadRequestError('create new product error')

    return newProduct
  }

  async updateProduct(product_id) {
    // console.log('this', this)

    const payload = removeUndefinedObject(this)

    // console.log('payload', payload)

    if (payload.product_attributes) {
      await updateProductById({
        product_id,
        payload: updateNestedObject(payload.product_attributes),
        model: clothing,
      })
    }
    const updateProduct = super.updateProduct(
      product_id,
      updateNestedObject(payload),
    )
    return updateProduct
  }
}
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    })
    if (!newElectronic) throw new BadRequestError('create new clothing error')

    const newProduct = super.createProduct(newElectronic._id)
    if (!newProduct) throw new BadRequestError('create new product error')

    return newProduct
  }

  async updateProduct(product_id) {
    console.log('this', this)

    const payload = removeUndefinedObject(this)

    console.log('payload', payload)

    if (payload.product_attributes) {
      await updateProductById({ product_id, payload, model: electronic })
    }
    const updateProduct = super.updateProduct(product_id, payload)
    return updateProduct
  }
}

productFactory.registerProductType('Electronic', Electronic)
productFactory.registerProductType('Clothing', Clothing)

module.exports = productFactory
