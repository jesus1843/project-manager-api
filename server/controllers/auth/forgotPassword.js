const UserModel = require('../../models/user');
const HashModel = require('../../models/hash');

const hashTypes = require('./hashTypes.json');
const { sendUpdatePasswordEmail } = require('../../emails/auth');


const forgotPassword = async(req, res) => {
    const { email } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        
        if (!user) {
            return res.status(404).json({
                code: 'EMAIL_NOT_FOUND',
                message: 'User does not exists'
            });
        }
        
        const changePasswordHash = await HashModel.create({ kind: hashTypes.FORGOT_PASSWORD });
        await changePasswordHash.setHash(30).save();

        user.hashes = [changePasswordHash.id];
        await user.save();

        await sendUpdatePasswordEmail({
            to: user.email,
            data: {
                hash: changePasswordHash.hash
            }
        });

        res.status(201).json({
            message: 'E-mail sent'
        });
    }
    catch(error) {
        res.status(500).json({
            error: JSON.parse(JSON.stringify(error))
        });
    }
}

module.exports = forgotPassword;
