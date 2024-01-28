const transporter = require("./nodeMailerConfig");

const sendEmail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: '"Auth_Workflow" <no_reply_admin@authworkflow.com>', // sender address
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
