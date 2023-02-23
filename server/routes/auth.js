const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth/index');


router
    .post('/login', AuthController.login)
    .post('/register', AuthController.register)
    .post('/resend-verify-email', AuthController.resendVerifyEmail)
    .put('/verify-email', AuthController.verifyEmail)
    .post('/forgot-password', AuthController.forgotPassword)
    .get('/change-password', AuthController.changePassword)
    .put('/change-password', AuthController.updatePassword);


module.exports = router;
