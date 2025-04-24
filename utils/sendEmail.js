const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1- Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // SMTP server address
    port: process.env.EMAIL_PORT, // SMTP server port
    secure: true, // Use TLS (true for port 465, false for other ports)
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASSWORD, // Your email password or app password
    },
  });

  // 2- Define the email options
  const mailOptions = {
    from: `E-Shop App <${process.env.EMAIL_USER}>`, // Sender address
    to: options.email, // Recipient address
    subject: options.subject, // Email subject
    text: options.message, // Plain text body
  };

  // 3- Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
