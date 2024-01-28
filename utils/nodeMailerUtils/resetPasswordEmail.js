const sendEmail = require("./sendEmail");

const resetPassword = async ({ name, email, passwordResetToken, origin }) => {
  const passwordResetLink = `${origin}?token=${passwordResetToken}&email=${email}`;
  const html = `<h4>Hey ${name},</h4>
    <p>Please go this <a href="${passwordResetLink}">link</a> to reset your password</p>`;
  return sendEmail({ to: email, subject: "Password Reset Email", html });
};

module.exports = resetPassword;
