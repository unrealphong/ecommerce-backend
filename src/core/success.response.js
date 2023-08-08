const { StatusCodes } = require('./httpStatusCode')

class SuccessResponse {
  constructor({
    message,
    status = StatusCodes.OK,
    metadata = {},
    options = {},
  }) {
    this.message = message
    this.status = status
    this.metadata = metadata
    this.options = options
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this)
  }
}

class Ok extends SuccessResponse {
  constructor({ message, metadata = {}, options = {} }) {
    super({ message, metadata, options })
  }
}

class Create extends SuccessResponse {
  constructor({ message, metadata = {}, options = {} }) {
    super({ message, status: StatusCodes.CREATED, metadata, options })
  }
}

const CREATED = (res, message, metadata, options = {}) => {
  new Create({
    message,
    metadata,
    options,
  }).send(res)
}

const OK = (res, message, metadata, options = {}) => {
  new Ok({
    message,
    metadata,
    options,
  }).send(res)
}

module.exports = {
  OK,
  CREATED,
  SuccessResponse,
}
