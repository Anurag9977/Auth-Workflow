const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", authMiddleware, logout);
router.patch("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password", resetPassword);

module.exports = router;
