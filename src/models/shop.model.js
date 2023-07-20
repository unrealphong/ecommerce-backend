'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'shops'

const shopSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 255,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      unum: ['active', 'inactive'],
      default: 'inactive',
    },
    verify: {
      type: Schema.Types.Boolean,
      default: false,
    },
    roles: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
)

module.exports = model(DOCUMENT_NAME, shopSchema)
