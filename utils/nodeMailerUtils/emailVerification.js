const sendEmail = require("./sendEmail");

const emailVerification = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verificationLink = `${origin}?token=${verificationToken}&email=${email}`;
  const html = `<h4>Hey ${name},</h4><br>
    <p>Please click on this <a href=${verificationLink}>link</a> to verify your email.</p>`;
  return sendEmail({ to: email, subject: "Email Verification", html });
};

module.exports = emailVerification;
