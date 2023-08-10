const { Router } = require('express')
const { apiKey, checkPermissions } = require('../auth/checkAuth')

const router = Router()

// check apiKey
router.use(apiKey)
// check permissions
router.use(checkPermissions('0000'))

router.use('/v1/api', require('./access'))
router.use('/v1/api/products', require('./product'))

module.exports = router
