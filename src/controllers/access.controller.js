'use strict'
const { CREATED, OK, SuccessResponse } = require('../core/success.response')
const catchAsync = require('../middleware/catch.async')
const accessService = require('../services/access.service')
class AccessController {
  // login = catchAsync(async (req, res) => {
  //   OK(res, 'Login success', await accessService.login(req.body))
  // })
  logout = catchAsync(async (req, res, next) => {
    new SuccessResponse({
      message: 'Logout success',
      metadata: await accessService.logout(req.keyStore),
    }).send(res)
  })
  login = catchAsync(async (req, res, next) => {
    new SuccessResponse({
      metadata: await accessService.login(req.body),
    }).send(res)
  })
  signUp = catchAsync(async (req, res) => {
    CREATED(res, 'Register success', await accessService.signUp(req.body))
  })
}

module.exports = new AccessController()
