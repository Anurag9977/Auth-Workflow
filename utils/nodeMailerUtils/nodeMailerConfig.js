const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "kathryn24@ethereal.email",
    pass: "QsRbgKX1a5gp1UaS4A",
  },
});

module.exports = transporter;
