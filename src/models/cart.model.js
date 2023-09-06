'use strict'

const { Types, model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      enum: ['active', 'completed', 'failed', 'pending'],
      default: 'active',
    },
    cart_product: { type: Array, required: true, default: [] },
    cart_count_product: { type: Number, required: true, default: 0 },
    cart_userId: { type: Number, required: true },
  },
  {
    timestamps: {
      createAt: 'createdOn',
      updateAt: 'modifiedOn',
    },
    collection: COLLECTION_NAME,
  },
)

module.exports = {
  cart: model(DOCUMENT_NAME, cartSchema),
}
