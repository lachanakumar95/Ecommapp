const router = require('express').Router();
const authController = require('./authController');

router.post('/register', authController.createUser);
router.post('/forget', authController.forgetPassword);
router.post('/login', authController.login);
router.post('/refreshToken', authController.refreshToken);
module.exports = router;