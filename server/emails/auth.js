const fs = require('fs');
const path = require('path');

const nodemailer = require('nodemailer');
const hbs = require('handlebars');


const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: +process.env.MAILTRAP_PORT,
    secure: false,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PWD
    }
});

const sendConfirmationEmail = async({ to, data }) => {
    const registeredEmailTemplate = fs.readFileSync(
        path.resolve(__dirname, '../views/emails/user_registered.hbs'),
        'utf8'
    );
    const hbsTemplate = hbs.compile(registeredEmailTemplate);

    let info = await transporter.sendMail({
        from: '"Project Manager Administrator" <admin@project_manager.com>', // sender address
        to, // list of receivers
        subject: "New User Registered", // Subject line
        text: "Hello world?", // plain text body
        html: hbsTemplate({
            email: to,
            frontend_url: process.env.FRONTEND_URL,
            ...data
        }), // html body
    });

    console.log("Message sent: %s", info.messageId);
}

const sendUpdatePasswordEmail = async({ to, data }) => {
    const registeredEmailTemplate = fs.readFileSync(
        path.resolve(__dirname, '../views/emails/update_password.hbs'),
        'utf8'
    );
    const hbsTemplate = hbs.compile(registeredEmailTemplate);

    let info = await transporter.sendMail({
        from: '"Project Manager Administrator" <admin@project_manager.com>', // sender address
        to, // list of receivers
        subject: "Update Password", // Subject line
        text: "Hello world?", // plain text body
        html: hbsTemplate({
            email: to,
            frontend_url: process.env.FRONTEND_URL,
            ...data
        }), // html body
    });
}


const resendVerifyEmail = async({ to, data }) => {
    const registeredEmailTemplate = fs.readFileSync(
        path.resolve(__dirname, '../views/emails/resend_verify_email.hbs'),
        'utf8'
    );
    const hbsTemplate = hbs.compile(registeredEmailTemplate);

    let info = await transporter.sendMail({
        from: '"Project Manager Administrator" <admin@project_manager.com>', // sender address
        to, // list of receivers
        subject: "Verify Account Email", // Subject line
        text: "Hello world?", // plain text body
        html: hbsTemplate({
            email: to,
            frontend_url: process.env.FRONTEND_URL,
            ...data
        }), // html body
    });
}


module.exports = {
    resendVerifyEmail,
    sendConfirmationEmail,
    sendUpdatePasswordEmail
}
