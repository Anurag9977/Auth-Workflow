const crypto = require("crypto");

const createHashString = (value) =>
  crypto.createHash("md5").update(value).digest("hex");

module.exports = createHashString;
