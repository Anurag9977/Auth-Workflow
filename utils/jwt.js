const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

//Send token as a cookie response
const attachCookiesToResponse = ({ res, payload }) => {
  const accessToken = createJWT({ payload: payload.tokenUser });
  const refreshToken = createJWT({ payload });
  const oneDay = 24 * 60 * 60 * 1000;
  const longerExp = 30 * 24 * 60 * 60 * 1000;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + longerExp),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

const JWTVerify = ({ token }) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  createJWT,
  attachCookiesToResponse,
  JWTVerify,
};
