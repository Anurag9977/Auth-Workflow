const crypto = require("crypto");
const { unAuthenticatedError, unAuthorizedError } = require("../errors");
const { JWTVerify, attachCookiesToResponse } = require("../utils");
const Token = require("../models/token");

const authMiddleware = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;

  if (!accessToken) {
    //Access Token Expired
    if (!refreshToken) {
      throw new unAuthenticatedError("Invalid Credentials");
    }
    const payload = JWTVerify({ token: refreshToken });
    const { tokenUser } = payload;
    req.userDetails = tokenUser;
    const token = await Token.findOne({
      refreshToken: payload.refreshToken,
      user: tokenUser.userID,
    });
    if (!token || !token?.isValid)
      throw new unAuthenticatedError("Invalid credentials or Invalid token");
    const newRefreshToken = crypto.randomBytes(40).toString("hex");
    token.refreshToken = newRefreshToken;
    await token.save();
    attachCookiesToResponse({
      res,
      payload: { tokenUser, refreshToken: token.refreshToken },
    });
    return next();
  }

  //Access Token Available
  const payload = JWTVerify({ token: accessToken });
  req.userDetails = payload;
  attachCookiesToResponse({
    res,
    payload: {
      tokenUser: payload,
      refreshToken,
    },
  });
  next();
};

const authorizePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userDetails.role)) {
      throw new unAuthorizedError("Unauthorized to access this route");
    }
    next();
  };
};

module.exports = { authMiddleware, authorizePermission };
