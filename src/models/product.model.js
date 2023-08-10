const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_desc: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ['Electronic', 'Clothing', 'Furniture'],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shops' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  },
)

// define the product type = clothing
const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shops',
    },
  },
  {
    collection: 'clothes',
    timestamps: true,
  },
)

// define the product type = Electronics
const electronicsSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    model: String,
    colo: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shops',
    },
  },
  {
    collection: 'electronics',
    timestamps: true,
  },
)

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  electronic: model('Electronics', electronicsSchema),
  clothing: model('Clothings', clothingSchema),
}
