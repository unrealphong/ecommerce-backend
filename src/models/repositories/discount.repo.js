'use strict'
const { unGetSelectData, getSelectData } = require('../../utils/')

const findAllDiscountCodesUnSelect = async ({
  limit = 50,
  page = 1,
  sort = 'ctime',
  filter,
  unSelect,
  model,
}) => {
  const skip = limit * (page - 1)
  const sortBy = sort === 'ctime' ? { ctime: -1 } : { utime: -1 }
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean()
  return documents
}

const findAllDiscountCodesSelect = async ({
  limit = 50,
  page = 1,
  sort = 'ctime',
  filter,
  select,
  model,
}) => {
  const skip = limit * (page - 1)
  const sortBy = sort === 'ctime' ? { ctime: -1 } : { utime: -1 }
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
  return documents
}

const checkDiscountExists = async ({ model, filter }) => {
  return await model.findOne(filter).lean()
}

module.exports = {
  checkDiscountExists,
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesSelect,
}
