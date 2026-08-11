import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, text) => {
    try {
        // Transporter setup (Gmail ke liye)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Aapki Gmail ID
                pass: process.env.EMAIL_PASS  // Gmail App Password
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};