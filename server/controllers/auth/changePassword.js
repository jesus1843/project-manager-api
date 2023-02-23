const UserModel = require('../../models/user');

const hashTypes = require('./hashTypes.json');


const changePassword = async(req, res) => {
    const { email, hash } = req.query;

    try {
        const user = await UserModel.findOne({ email }).populate('hashes').exec();

        if (!user) {
            return res.status(404).json({
                code: 'EMAIL_NOT_FOUND',
                message: 'User does not exists'
            });
        }

        const changePasswordHash = user.hashes.find(hashh => hashh.hash === hash);

        if (!changePasswordHash && changePasswordHash.kind !== hashTypes.FORGOT_PASSWORD) {
            return res.status(403).json({
                code: 'HASH_NOT_VALID_OR_MISSING',
                message: 'Hash string is not valid or is missing'
            });
        }

        if (changePasswordHash.usedAt) {
            return res.status(403).json({
                code: 'HASH_USED',
                message: 'Hash cannot be user more than once'
            });
        }

        res.json({ message: 'User can update his/her password' });
    }
    catch(error) {
        res.status(500).json({
            error: JSON.parse(JSON.stringify(error))
        });
    }
}

module.exports = changePassword;
