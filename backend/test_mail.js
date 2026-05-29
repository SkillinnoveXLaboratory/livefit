const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require('nodemailer');

console.log("USER:", process.env.EMAIL_USER);
console.log("PASS:", process.env.EMAIL_PASS ? "Loaded (hidden)" : "Not Loaded");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: 'work.fit.wellnesss@gmail.com',
  subject: 'Test Nodemailer',
  text: 'Hello from test script!'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Error sending email:", error);
  } else {
    console.log("Email sent successfully:", info.response);
  }
  process.exit();
});
