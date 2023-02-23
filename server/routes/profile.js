const express = require('express');
const fileUpload = require('express-fileupload');

const router = express.Router();

const avatarImageHelpers = require('../helpers/avatar_image');
const AuthMiddleware = require('../middlewares/auth');

const ProfileController = require('../controllers/profile');


router
    .use(fileUpload({
        useTempFiles: true,
        tempFileDir: avatarImageHelpers.TEMP_PATH,
        debug: !!+process.env.DEBUG,
        ...(
            +process.env.DEBUG
                ? {
                    createParentPath: true,
                    limits: 1024 * 1024,
                    preserveExtension: true,
                    safeFileNames: true
                }
                : { }
        ),
    }))
    .get('', [AuthMiddleware.isAuthenticatedHeader, AuthMiddleware.isVerified], ProfileController.fetchProfile)
    .put('', [AuthMiddleware.isAuthenticatedHeader, AuthMiddleware.isVerified], ProfileController.updateProfile)
    .get('/avatar', [AuthMiddleware.isAuthenticatedAvatar], ProfileController.fetchAvatar)
    .post('/avatar', [AuthMiddleware.isAuthenticatedHeader, AuthMiddleware.isVerified], ProfileController.uploadAvatar)
    .get('/avatar/temps', [AuthMiddleware.isAuthenticatedAvatar], ProfileController.temps);


module.exports = router;
