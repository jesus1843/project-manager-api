const UserModel = require('../../models/user');


const verifyEmail = async(req, res) => {
    const { email, hash } = req.body;

    try {
        const user = await UserModel.findOne({ email }).populate('hashes').exec();

        if (!user) {
            return res.status(404).json({
                code: 'EMAIL_NOT_FOUND',
                message: 'User does not exists'
            });
        }

        const verifyHash = user.hashes.find(hash => hash.hash);

        if (!verifyHash) {
            return res.status(403).json({
                code: 'HASH_NOT_VALID_OR_MISSING',
                message: 'Hash string is not valid or is missing'
            });
        }

        if (verifyHash.usedAt) {
            return res.status(403).json({
                code: 'EMAIL_VERIFIED',
                message: 'E-mail has been verified'
            });
        }

        verifyHash.usedAt = new Date();
        await verifyHash.save();

        res.status(200).json({ message: 'User verified' });
    }
    catch(err) {
        res.status(500).json({
            error: JSON.parse(JSON.stringify(err))
        });
    }
}

module.exports = verifyEmail;
