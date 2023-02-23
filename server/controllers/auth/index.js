const register = require('./register');
const login = require('./login');
const resendVerifyEmail = require('./resendVerifyEmail');
const verifyEmail = require('./verifyEmail');
const forgotPassword = require('./forgotPassword');
const changePassword = require('./changePassword');
const updatePassword = require('./updatePassword');

module.exports = {
    register,
    login,
    resendVerifyEmail,
    verifyEmail,
    forgotPassword,
    changePassword,
    updatePassword
}

