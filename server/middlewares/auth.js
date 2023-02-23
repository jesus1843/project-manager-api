const jwt = require('jsonwebtoken');


const isAuthenticatedHeader = (req, res, next) => {
    if ('authorization' in req.headers) {
        const { authorization } = req.headers;
        const [_, token] = authorization.split('Bearer ');
        const tokenDecoded = jwt.decode(token, process.env.SECRET_JWT);
        if (!tokenDecoded) {
            res.status(401).json({
                error: {
                    code: 'TokenNotValid',
                    message: 'Error in token expected'
                }
            });
        }
        req.user = tokenDecoded.user;
        next();
    } else {
        res.status(401).json({
            error: {
                code: 'NotAuthenticated',
                message: 'No Authenticated'
            }
        });
    }
}

const isAuthenticatedAvatar = (req, res, next) => {
    const { token } = req.query;
    const tokenDecoded = jwt.decode(token, process.env.SECRET_JWT);

    if (tokenDecoded) {
        req.user = tokenDecoded.user;
    }

    next();
}

const isVerified = async(req, res, next) => {
    const user = req.user;

    const hasVerifyHashes = user.hashes && Object.keys(user.hashes).includes('verify_account');
    if (hasVerifyHashes) {
        return res.status(403).json({
            error: {
                code: 'NotValidated',
                message: 'User Account not Validated'
            }
        });
    }

    next();
}

const isAuthorized = (req, res, next) => {
    console.log('Is Authorized');
    next();
}


module.exports = {
    isAuthenticatedHeader,
    isAuthenticatedAvatar,
    isVerified,
    isAuthorized
}
