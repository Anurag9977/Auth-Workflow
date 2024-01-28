const { createJWT, attachCookiesToResponse, JWTVerify } = require("./jwt");
const createTokenUser = require("./createTokenUser");
const emailVerification = require("./nodeMailerUtils/emailVerification");
const resetPasswordEmail = require("./nodeMailerUtils/resetPasswordEmail");
const createHash = require("./createHash");

module.exports = {
  createJWT,
  attachCookiesToResponse,
  JWTVerify,
  createTokenUser,
  emailVerification,
  resetPasswordEmail,
  createHash,
};
