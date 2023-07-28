const { Schema, model } = require('mongoose')
const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'
const keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },
    privateKey: {
      type: String,
      required: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    refreshTokenUsed: {
      type: Array,
      default: [], // nhung refreshToken da duoc su dung
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  },
)

module.exports = model(DOCUMENT_NAME, keyTokenSchema)
