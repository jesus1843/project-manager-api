const UserModel = require('../../models/user');
const ProfileModel = require('../../models/profile');
const HashModel = require('../../models/hash');

const hashTypes = require('./hashTypes.json');

const { sendConfirmationEmail } = require('../../emails/auth');


const register = async(req, res) => {
    const { email } = req.body;

    try {
        const user = new UserModel({ email });
        const passwordGenerated = user.setPassword();

        const verifyAccountHash = await HashModel.create({ kind: hashTypes.VERIFY_ACCOUNT });
        await verifyAccountHash.setHash(30).save();

        user.hashes = [verifyAccountHash.id];
        await user.save()
            .then(async(savedUser) => {
                await ProfileModel.create({ userId: savedUser.id });
                return savedUser;
            });

        await sendConfirmationEmail({
            to: user.email,
            data: {
                password: passwordGenerated,
                hash: verifyAccountHash.hash
            }
        });

        res.status(201).json({ message: 'User created successfully' });
    }
    catch(err) {
        res.status(500).json({
            error: JSON.parse(JSON.stringify(err))
        })
    }
};

module.exports = register;
