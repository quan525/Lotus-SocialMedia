const nodemailer = require("nodemailer");
require('dotenv').config();

const sendEmail = async (email, subject, text) => {
    try {
        console.log(typeof process.env.EMAIL)
        console.log(process.env.EMAILPASS)
        const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAILPASS,
            },
        });

        const result = await transporter.sendMail({
            from: "LOTUS@gmail.com",
            to: email,
            subject: subject,
            text: text,
        });
        
        console.log("email sent sucessfully");
        console.log(result)
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;