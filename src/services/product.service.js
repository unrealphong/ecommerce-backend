'use strict'

const { BadRequestError } = require('../core/error.response')
const { product, clothing, electronic } = require('../models/product.model')

class productFactory {
  // static async createProduct(type, payload) {
  //   switch (type) {
  //     case 'Clothing':
  //       return new Clothing(payload).createProduct()
  //     case 'Electronic':
  //       return new Electronic(payload).createProduct()
  //     default:
  //       throw new BadRequestError(`Invalid Product Types ${type}`)
  //   }
  // }
  static productRegistry = {} // key class

  static registerProductType(type, classRef) {
    productFactory.productRegistry[type] = classRef
  }

  static async createProduct(type, payload) {
    const productClass = productFactory.productRegistry[type]
    if (!productClass) throw new BadRequestError(`Invalid Product Type ${type}`)

    return await new productClass(payload).createProduct()
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
    return await product.create({ ...this, _id: product_id })
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
}

productFactory.registerProductType('Electronic', Electronic)
productFactory.registerProductType('Clothing', Clothing)

module.exports = productFactory
