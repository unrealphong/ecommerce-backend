// 'use strict'

const { Types } = require('mongoose')
const { product, electronic, clothing } = require('../product.model')
const {
  getSelectData,
  unGetSelectData,
  convertToObjectId,
} = require('../../utils')

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

const findAllDraftForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip })
}

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  })

  if (!foundShop) return null

  foundShop.isDraft = false
  foundShop.isPublished = true

  const { modifiedCount } = await foundShop.updateOne(foundShop)
  return modifiedCount
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  })

  if (!foundShop) return null

  foundShop.isDraft = true
  foundShop.isPublished = false

  const { modifiedCount } = await foundShop.updateOne(foundShop)
  return modifiedCount
}

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch)
  const results = await product
    .find(
      {
        isPublished: true,
        $text: { $search: regexSearch },
      },
      { score: { $meta: 'textScore' } },
    )
    .sort({ score: { $meta: 'textScore' } })
    .lean()
  return results
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { ctime: -1 } : { price: -1 }
  const results = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()

  return results
}

const findProduct = async ({ product_id, unSelect }) => {
  const result = await product
    .findById(product_id)
    .select(unGetSelectData(unSelect))
    .lean()
  return result
}

const updateProductById = async ({
  product_id,
  payload,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(product_id, payload, {
    new: isNew,
  })
}

const getProductById = async (product_id) => {
  return await product.findOne({ _id: convertToObjectId(product_id) }).lean()
}

const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductById(product.productId)
      if (foundProduct) {
        return {
          price: foundProduct.price,
          quantity: foundProduct.quantity,
          productId: product.productId,
        }
      }
    }),
  )
}

module.exports = {
  checkProductByServer,
  getProductById,
  updateProductById,
  findProduct,
  findAllProducts,
  findAllDraftForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductByUser,
}
