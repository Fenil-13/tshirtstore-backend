const nodemailer = require('nodemailer')

const mailhelper = async (options) => {

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const mesage = {
        from: 'fjmoradiya@gmail.com', // sender address
        to: options.emails, // list of receivers
        subject: options.subject, // Subject line
        text: options.message, // plain text body
    }

    // send mail with defined transport object
    await transporter.sendMail(mesage);
}

module.exports = mailhelper