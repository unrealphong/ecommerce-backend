const { Router } = require('express')
const { authentication, authenticationV2 } = require('../../auth/authUtils')
const productController = require('../../controllers/product.controller')

const router = Router()

router.get('/search/:keySearch', productController.getListSearchProduct)
// authentication
router.use(authenticationV2)

router.post('', productController.createProduct)
router.post('/publish/:id', productController.publishProductByShop)
router.post('/unpublish/:id', productController.unPublishProductByShop)

router.get('/drafts/all', productController.getAllDraftsForShop)
router.get('/published/all', productController.getAllPublishForShop)

module.exports = router
