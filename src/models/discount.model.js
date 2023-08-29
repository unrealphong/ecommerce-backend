'use strict'

const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'

const discountSchema = new Schema(
  {
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: 'fixed amount' }, //percentage or fixed amount
    discount_value: { type: Number, required: true }, // 10% or 10$
    discount_code: { type: String, required: true },
    discount_startDate: { type: Date, required: true },
    discount_endDate: { type: Date, required: true },
    discount_maxUse: { type: Number, requered: true }, // max use
    discount_maxValue: { type: Number, required: true },
    discount_maxUsePerUser: { type: Number, requered: true }, // max use per user
    discount_usesCount: { type: Number, required: true }, // number of times the discount has been used
    discount_usersUsed: { type: Array, default: [] }, // user_id
    discount_minOrder: { type: Number, required: true }, // min order to use the discount
    discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    discount_status: { type: Boolean, default: true }, // active or inactive
    discount_applyTo: {
      type: String,
      required: true,
      enum: ['all', 'specific'],
    }, // all or specific products
    discount_productIds: { type: Array, default: [] }, // product_id
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
)

module.exports = model(DOCUMENT_NAME, discountSchema)
