'use strict'

const { BadRequestError } = require('../core/error.response')
const { findCartById } = require('../models/repositories/cart.repo')
const { checkProductByServer } = require('../models/repositories/product.repo')
const { getDiscountAmount } = require('./discount.service')

/*
    {
        "cartId": "5f8f1f8b4f5e9d2c6c0a2c6b",
        "userId": "5f8f1f8b4f5e9d2c6c0a2c6a",
        "shop_order_ids": [
            {
                shopId
                shop_discount: []
                item_products: [
                    {
                        productId,
                        quantity
                        shopId
                        price
                        old_quantity
                    }
                ],
            },
            {
                shopId
                shop_discount: []
                item_products: [
                    {
                        productId,
                        quantity
                        shopId
                        price
                        old_quantity
                    }
                ],
            }
        ]
    }
 */
class CheckoutService {
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    // check cartId
    const foundCart = await findCartById(cartId)
    if (!foundCart) throw new BadRequestError('Cart not found')

    const checkout_order = {
        totalPrice: 0,
        feeship: 0,
        totalDiscount: 0,
        totalPayment: 0,
        totalCheckout: 0,
      },
      shop_order_ids_new = []

    for (let index = 0; index < shop_order_ids.length; index++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[index]

      const checkProductServer = await checkProductByServer(item_products)
      if (!checkProductByServer[0]) throw new BadRequestError('order wrong')

      const checkoutPrice = await checkProductServer.reduce((acc, prod) => {
        return acc + prod.quantity * prod.price
      }, 0)

      checkout_order.totalPrice = +checkoutPrice

      const item_checkout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      }

      if (shop_discounts.length > 0) {
        const { totalPrice = 0, discount = 0 } = getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer,
        })

        checkout_order.totalDiscount += discount

        if (discount > 0) {
          item_checkout.priceApplyDiscount = checkoutPrice - discount
        }
      }

      checkout_order.totalCheckout +=
        item_checkout.shop_order_ids_new.push(item_checkout)
    }
    return { shop_order_ids, shop_order_ids_new, checkout_order }
  }

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkout_order } =
      await CheckoutService.checkoutReview({
        cartId,
        userId,
        shop_order_ids,
      })

    const products = shop_order_ids_new.flatMap((order) => order.item_products)

    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i]
    }
  }
}

module.exports = CheckoutService
