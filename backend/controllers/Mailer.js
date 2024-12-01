const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config(); 

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true,
  debug: true,
});


const mailOptions = {
  from: process.env.EMAIL_USER, 
  to: 'daiana.rehan.dr@gmail.com',
  subject: 'Test Email from Node.js',
  text: 'Hello, this is a test email from Node.js!',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
      console.log('Error:', error);
  } else {
      console.log('Email sent:', info.response);
  }
});

module.exports = transporter;