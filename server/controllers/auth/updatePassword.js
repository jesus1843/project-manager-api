const UserModel = require('../../models/user');

const hashTypes = require('./hashTypes.json');


const updatePassword = async(req, res) => {
    const { email, hash } = req.query;
    const { password1, password2 } = req.body;

    try {
        if (password1 !== password2) {
            return res.status(401).json({
                code: 'PASSWORDS_NOT_MATCH',
                message: 'Both passwords must be the same'
            });
        }

        const user = await UserModel.findOne({ email }).populate('hashes').exec();

        if (!user) {
            return res.status(404).json({
                code: 'EMAIL_NOT_FOUND',
                message: 'User does not exists'
            });
        }

        const changePasswordHash = user.hashes.find(hashh => hashh.hash === hash);

        if (!changePasswordHash || changePasswordHash.kind !== hashTypes.FORGOT_PASSWORD) {
            return res.status(403).json({
                code: 'HASH_NOT_VALID_OR_MISSING',
                message: 'Hash string is not valid or is missing'
            });
        }

        await user.setNewPassword(password1).save();

        changePasswordHash.usedAt = new Date();
        await changePasswordHash.save();

        res.status(201).json({
            message: 'Password updated successfully'
        });
    }
    catch(err) {
        res.status(500).json({
            error: JSON.parse(JSON.stringify(err))
        });
    }
}

module.exports = updatePassword;
