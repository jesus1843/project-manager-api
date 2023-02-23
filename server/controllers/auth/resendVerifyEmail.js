const { resendVerifyEmail: resendEmail } = require('../../emails/auth');


const resendVerifyEmail = async(req, res) => {
    const { email, hash } = req.body;

    try {
        await resendEmail({
            to: email,
            data: {
                hash
            }
        });

        res.json({ message: 'Message sent successfully' });
    }
    catch(err) {
        res.status(500).json({
            error: JSON.parse(JSON.stringify(err))
        });
    }
}

module.exports = resendVerifyEmail;
