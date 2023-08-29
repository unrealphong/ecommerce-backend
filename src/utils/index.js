const e = require('express')
const _ = require('lodash')
const { Types } = require('mongoose')

const convertToObjectId = (id) => new Types.ObjectId(id)

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields)
}

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((field) => [field, 1]))
}

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((field) => [field, 0]))
}

const removeUndefinedObject = (object) => {
  Object.keys(object).forEach((key) => {
    if (object[key] == null) delete object[key]
  })
  return object
}

const updateNestedObject = (object) => {
  const result = {}
  Object.keys(object).forEach((key) => {
    console.log(key)
    if (typeof object[key] === 'object' && !Array.isArray(object[key])) {
      const response = updateNestedObject(object[key])
      Object.keys(response).forEach((nestedKey) => {
        result[`${key}.${nestedKey}`] = response[nestedKey]
      })
    } else {
      result[key] = object[key]
    }
  })
  console.log(result)
  return result
}

module.exports = {
  unGetSelectData,
  getSelectData,
  getInfoData,
  removeUndefinedObject,
  updateNestedObject,
  convertToObjectId,
}
