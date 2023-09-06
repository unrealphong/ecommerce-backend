'use strict'

const { model } = require('mongoose')
const { cart } = require('../models/cart.model')
const { getProductById } = require('../models/repositories/product.repo')
const { NotFoundError } = require('../core/error.response')
/**
 * - Add product to cart - user
 * - Reduce product quantity by one - user
 * - increase product quantity by one - user
 * - get cart - user
 * - delete cart - user
 * - delete cart item - user
 * */

class CartService {
  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: 'active' },
      updateOrInsert = {
        $addToSet: {
          cart_product: product,
        },
      },
      options = { upsert: true, new: true }

    return await cart.findOneAndUpdate(query, updateOrInsert, options)
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { product_id, quantity } = product
    const query = {
        cart_userId: userId,
        'cart_product.product_id': product_id,
        cart_state: 'active',
      },
      updateSet = {
        $inc: {
          'cart_product.$.quantity': quantity,
        },
      },
      options = { upset: true, new: true }

    return await cart.findOneAndUpdate(query, updateSet, options)
  }

  static async addToCart({ userId, product = {} }) {
    // check cart có tồn tại hay không ?
    const userCart = await cart.findOne({ cart_userId: userId })
    if (!userCart) {
      // create new cart for user
      return await CartService.createUserCart({ userId, product })
    }

    // nếu có giỏ hàng rồi nhưng chưa có sản phẩm nào)
    if (!userCart.cart_product.length) {
      userCart.cart_product = [product]
      return await userCart.save()
    }

    // nếu có giỏ hàng rồi và có sản phẩm thì update quantity
    return await CartService.updateUserCartQuantity({ userId, product })
  }

  /**
   * Update cart
   *
   * shop_order_ids: [
   *   {
   *      shop_id,
   *      item_product: [
   *        {
   *          productId,
   *          quantity
   *          shopId
   *          price
   *          old_quantity
   *        }
   *      ],
   *      version
   *  }
   * */
  static async addToCartV2({ userId, shop_order_ids }) {
    const { product_id, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0]

    //check product
    const foundProduct = await getProductById(product_id)

    if (!foundProduct) throw new NotFoundError('Product not found')
    console.log(foundProduct)
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError('Product do not belong to the shop')
    }
    if (quantity === 0) {
      // deleted
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        product_id,
        quantity: quantity - old_quantity,
      },
    })
  }

  static async deleteUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: 'active' },
      updateSet = {
        $pull: {
          cart_product: {
            productId,
          },
        },
      }
    const deleteCart = await cart.updateOne(query, updateSet)
    return deleteCart
  }

  static async getListUserCart({ userId }) {
    return await cart
      .findOne({
        cart_userId: +userId,
      })
      .lean()
  }
}
module.exports = CartService
