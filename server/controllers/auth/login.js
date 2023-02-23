const jwt = require('jsonwebtoken');

const UserModel = require('../../models/user');


const login = async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel
                        .findOne({ email })
                        .populate('hashes')
                    .exec();

        if (!user) {
            return res.status(404).json({
                code: 'EMAIL_OR_PWD_WRONG',
                message: '[E-mail] or password are wrong'
            });
        }

        if (!user.validPassword(password)) {
            return res.status(404).json({
                code: 'EMAIL_OR_PWD_WRONG',
                message: 'E-mail or [password] are wrong'
            });
        }

        const userToken = {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            ...(
                !user.hashes.length
                    ? {
                        hashes: user.hashes
                            .filter(hash => !hash.usedAt)
                            .reduce((obj, hash) => ({ ...obj, [hash.kind]: hash.hash }), {})
                    }
                    : { }
            )
        }

        const token = jwt.sign(
            { user: userToken },
            process.env.SECRET_JWT,
            { expiresIn: +process.env.EXPIRETIME_JWT }
        );

        res.status(200).json({
            data: {
                user: userToken,
                token,
                expiresIn: +process.env.EXPIRETIME_JWT
            }
        });
    }
    catch(err) {
        res.status(500).json({
            error: JSON.parse(JSON.stringify(err))
        });
    }
};

module.exports = login;
