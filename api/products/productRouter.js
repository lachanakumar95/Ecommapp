const router = require('express').Router();
const productController = require('./productController');
const upload = require('../../middleware/uploadMiddleware');
const auth = require('../../middleware/authMiddleware');

router.post('/product', auth.verifyAccessToken, upload.fields([
    { name: 'thumb', maxCount: 1 },       // Single file (thumb)
    { name: 'images', maxCount: 10 }       // Multiple files (images)
  ]), productController.addProducts);

router.put('/product/:id', auth.verifyAccessToken, upload.single('thumb'), productController.updateProduct);
// router.put('/product/images/update/:id', productController.deleteProductImages);
router.get('/product', productController.getProdducts);
module.exports = router;        