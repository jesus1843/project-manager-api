const express = require('express');
const router = express.Router();

const AuthMiddleware = require('../middlewares/auth');


const generalMiddlewares = [
    AuthMiddleware.isAuthenticatedHeader,
    AuthMiddleware.isVerified
];

router.get('', (req, res, next) => res.json(require('../data/endpoints.json')));

router
    .use('/auth', require('./auth'))
    .use('/profile', require('./profile'))
    .use('/projects', generalMiddlewares, require('./projects'));


module.exports = router;
