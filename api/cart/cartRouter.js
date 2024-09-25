const router = require('express').Router();
const cartController = require('./cartController');
const auth = require('../../middleware/authMiddleware');

router.post('/cart', auth.verifyAccessToken, cartController.addToCart);
router.put('/cart', auth.verifyAccessToken, cartController.updateCarts);
router.get('/cart', auth.verifyAccessToken, cartController.getCard);
module.exports = router;