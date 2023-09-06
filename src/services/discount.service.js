'use strict';
const { BadRequestError, NotFoundError } = require('../core/error.response');
const { OK } = require('../core/success.response');
const discount = require('../models/discount.model');
const { product } = require('../models/product.model');
const {
  findAllDiscountCodesUnSelect,
  checkDiscountExists,
  findAllDiscountCodesSelect,
} = require('../models/repositories/discount.repo');
const { findAllProducts } = require('../models/repositories/product.repo');
const { convertToObjectId } = require('../utils');
/**
 *  Discount service
 *
 *  1. Generate discount code [Shop | Admin]
 *  2. Get discount amount
 *  3. Get all discount code
 *  4. Verify discount code
 *  5. Delete discount code
 *  6. Cancel discount code
 *
 * */

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      status,
      shopId,
      min_order_value,
      productIds,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
      uses_used,
    } = payload;

    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError('Discount code has expired');
    }

    if (new Date(start_date) >= new Date(end_date))
      throw new BadRequestError('Start data must be before end date');

    // create index for discount code
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectId(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_status) {
      throw new BadRequestError('Discount code already exists');
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_minOrder: min_order_value || 0,
      discount_maxUse: max_uses,
      discount_maxValue: max_value,
      discount_startDate: new Date(start_date),
      discount_endDate: new Date(end_date),
      discount_shopId: shopId,
      discount_applyTo: applies_to,
      discount_usersUsed: uses_used,
      discount_usesCount: uses_count,
      discount_status: status,
      discount_productIds: applies_to === 'all' ? [] : productIds,
      discount_maxUsePerUser: max_uses_per_user,
    });

    return newDiscount;
  }

  static async updateDiscountCode({ discount_code }) { }

  /*
      Get all discount codes available with products
    */

  static async getAllDiscountCodesWithProduct({
    code,
    shopId,
    userId,
    page,
    limit,
    status,
  }) {
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectId(shopId),
      })
      .lean();
    if (!foundDiscount || !foundDiscount.discount_status)
      throw new NotFoundError('Discount code not found');

    const { discount_productIds, discount_applyTo } = foundDiscount;

    let products;
    if (discount_applyTo === 'all') {
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectId(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name', 'product_price', 'product_discount'],
      });
    }

    if (discount_applyTo === 'specific') {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_productIds },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name', 'product_price', 'product_discount'],
      });
    }

    return products;
  }

  /*
   * Get all  discount code for shop
   */
  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodesSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectId(shopId),
        discount_status: true,
      },
      select: ['discount_code', 'discount_name', 'discount_description'],
      model: discount,
    });
    return discounts;
  }

  /*
   * Apply discount code
   *
   * products = [
   *  {
   *    productId,
   *    shopId,
   *    quantity,
   *    name,
   *    price,
   *  },
   *  {
   *    productId,
   *    shopId,
   *    quantity,
   *    name,
   *    price,
   *  }
   * ]
   */

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectId(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError('Discount code not found');

    const {
      discount_status,
      discount_maxUse,
      discount_minOrder,
      discount_usersUsed,
      discount_maxUsePerUser,
      discount_type,
      discount_value,
    } = foundDiscount;
    if (!discount_status) throw new NotFoundError('Discount code not found');
    if (!discount_maxUse) throw new NotFoundError('Discount code not found');

    if (
      new Date() < new Date(foundDiscount.discount_startDate) ||
      new Date() > new Date(foundDiscount.discount_endDate)
    ) {
      throw new NotFoundError('Discount code has expired');
    }

    let totalOrder = 0;

    if (discount_minOrder > 0) {
      totalOrder = products.reduce((previous, current) => {
        return previous + current.price * current.quantity;
      }, 0);

      if (totalOrder < discount_minOrder) {
        throw new BadRequestError(
          `Discount code is only valid for orders over ${discount_minOrder}`,
        );
      }
    }

    console.log('totalOrder', totalOrder);
    if (discount_maxUsePerUser > 0) {
      const userUserDiscount = await discount_usersUsed.find(
        (user) => user.userId === userId,
      );
      if (userUserDiscount) {
      }
    }

    const discountAmount =
      discount_type === 'fixed_amount'
        ? discount_value
        : (totalOrder * discount_value) / 100;

    return {
      totalOrder,
      discount: discountAmount,
      totalPrice: totalOrder - discountAmount,
    };
  }

  /*
   *  Delete discount code
   */

  static async deleteDiscountCode({ codeId, shopId }) {
    const foundDiscount = await discount.findOne({
      discount_code: codeId,
      discount_shopId: convertToObjectId(shopId),
    });

    if (!foundDiscount) throw new NotFoundError('Discount code not found');

    if (foundDiscount.discount_status)
      throw new BadRequestError('Discount code is active');

    await discount.deleteOne();
    return {
      message: 'Discount code deleted successfully',
    };
  }

  static async cancelDiscountCode({ codeId, shopId }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectId(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError('Discount code not found');

    if (!foundDiscount.discount_status)
      throw new BadRequestError('Discount code is already inactive');

    foundDiscount.discount_status = false;
    const result = await discount.findOneAndUpdate(foundDiscount._id, {
      $pull: {
        discount_usersUsed: userId,
      },

      $inc: {
        discount_maxUse: 1,
        discount_usesCount: -1,
      },
    });
    return result;
  }
}

module.exports = DiscountService;
