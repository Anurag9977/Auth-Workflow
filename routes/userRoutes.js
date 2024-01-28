const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const showCurrentUser = require("../controllers/userController");

router.get("/showMe", authMiddleware, showCurrentUser);

module.exports = router;
