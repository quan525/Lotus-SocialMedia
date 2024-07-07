const express = require("express");
const { Login, Register, ForgotPassword, ResetPassword } = require("../controllers/UserController");
const router = express.Router();
const parser = require("../config/multer");

router.post("/register", parser.single('file'), Register);

router.post("/login", Login);

router.post("/logout")

router.post("/forgot_password", ForgotPassword);

router.post("/reset_password", ResetPassword)
module.exports = router;