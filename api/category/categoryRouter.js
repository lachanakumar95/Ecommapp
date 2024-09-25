const router = require('express').Router();
const categoryController = require('./categoryController');
const imageUploadMiddleware = require('../../middleware/uploadMiddleware');

const authMiddleware = require('../../middleware/authMiddleware');

router.post('/category', authMiddleware.verifyAccessToken, imageUploadMiddleware.single('image'), categoryController.addCategory);
router.put('/category/:id', authMiddleware.verifyAccessToken, imageUploadMiddleware.single('image'), categoryController.updateCategory);
router.get('/category', categoryController.getAllCategory);
router.delete('/category/:id', authMiddleware.verifyAccessToken, categoryController.deleteCategory);

module.exports = router;