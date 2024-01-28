require("dotenv").config();
const crypto = require("crypto");
const { StatusCodes } = require("http-status-codes");
const {
  badRequestError,
  unAuthenticatedError,
  unAuthorizedError,
  notFoundError,
} = require("../errors");
const User = require("../models/user");
const Token = require("../models/token");
const {
  attachCookiesToResponse,
  createTokenUser,
  emailVerification,
  resetPasswordEmail,
  createHash,
} = require("../utils");

//REGISTER
const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new badRequestError("Please provide name, email and password");
  }
  const emailAlreadyInUse = await User.findOne({ email });
  if (emailAlreadyInUse) {
    throw new badRequestError("Email already in use");
  }
  //Select role for the new user
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";
  //Verification Token
  const verificationToken = crypto.randomBytes(40).toString("hex");
  //Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
  });
  await emailVerification({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin: `${process.env.CLIENT_ORIGIN}/email-verification/email-verification.html`,
  });
  res.status(StatusCodes.CREATED).json({
    message:
      "Success. Please check your email and verify usng the link provided. ",
  });
};

//EMAIL-VERIFICATION
const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;
  if (!verificationToken)
    throw new badRequestError("Please provide a verification token");
  const user = await User.findOne({
    email,
  });
  if (!user)
    throw new unAuthenticatedError(`User with email : ${email} not found`);
  if (user.isVerified) throw new badRequestError("User already verified");
  if (verificationToken !== user.verificationToken)
    throw new unAuthenticatedError("Verification token doesn't match");
  user.verificationToken = "";
  user.isVerified = true;
  user.verified = Date.now();
  await user.save();
  res.status(StatusCodes.OK).json({
    message: "User is now verified!",
    user,
  });
};

//LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new badRequestError("Please provide email and password");
  }
  //Check if email exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new unAuthenticatedError("Email does not exist. Please register");
  }
  //Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new unAuthenticatedError("Incorrect password entered!");
  }
  //Check if the email is verified
  if (!user.isVerified)
    throw new unAuthorizedError("Please verify email to login");
  //Check if refresh token already exists
  const findToken = await Token.findOne({
    user: user._id,
  });
  if (findToken) {
    const tokenUser = createTokenUser({ user });
    attachCookiesToResponse({
      res,
      payload: { tokenUser, refreshToken: findToken.refreshToken },
    });
    return res.status(StatusCodes.OK).json({ user: tokenUser });
  }
  //Create a doc for token model
  const refreshToken = crypto.randomBytes(40).toString("hex");
  const ip = req.ip;
  const userAgent = req.headers["user-agent"];
  const token = await Token.create({
    refreshToken,
    ip,
    userAgent,
    user: user._id,
  });
  //Create the payload for JWT Cookies
  const tokenUser = createTokenUser({ user });
  attachCookiesToResponse({
    res,
    payload: { tokenUser, refreshToken: token.refreshToken },
  });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

//LOGOUT
const logout = async (req, res) => {
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).send("Logged out successfully!");
};

//FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) throw new badRequestError("Please provide your email");
  const user = await User.findOne({
    email,
  });
  if (user) {
    //Set password reset token and expiry
    const resetToken = crypto.randomBytes(40).toString("hex");
    const tenMinutes = 24 * 60 * 60 * 1000;
    user.passwordResetToken = createHash(resetToken);
    user.passwordResetTokenExpiry = new Date(Date.now() + tenMinutes);
    await user.save();
    //Send password reset email
    await resetPasswordEmail({
      name: user.name,
      email,
      passwordResetToken: resetToken,
      origin: `${process.env.CLIENT_ORIGIN}/reset-password/reset-password.html`,
    });
  }
  res.status(StatusCodes.OK).json({
    message: `Password reset link sent at your email : ${email}`,
  });
};

//RESET PASSWORD
const resetPassword = async (req, res) => {
  const { email, passwordResetToken, newPassword } = req.body;
  if (!email || !passwordResetToken)
    throw new badRequestError("Please provide email and password reset token");
  const user = await User.findOne({
    email,
  });
  if (!user) throw new notFoundError(`No user found with email : ${email}`);
  if (!user.passwordResetToken)
    throw new badRequestError("No password reset token found");
  if (createHash(passwordResetToken) !== user.passwordResetToken)
    throw new badRequestError("Password reset token is not correct");
  if (user.passwordResetTokenExpiry <= Date.now())
    throw new badRequestError("Password reset timed out");
  user.password = newPassword;
  user.passwordResetToken = "";
  user.passwordResetTokenExpiry = null;
  await user.save();
  res.status(StatusCodes.OK).json({
    message: "Password Updated. Please proceed to login.",
  });
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
