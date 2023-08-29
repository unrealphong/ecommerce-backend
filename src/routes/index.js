const { Router } = require('express')
const { apiKey, checkPermissions } = require('../auth/checkAuth')

const router = Router()

// check apiKey
router.use(apiKey)
// check permissions
router.use(checkPermissions('0000'))

router.use('/v1/api/discounts', require('./discount'))
router.use('/v1/api/products', require('./product'))
router.use('/v1/api', require('./access'))

module.exports = router
