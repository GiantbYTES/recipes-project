const express = require("express");
const { login, register, profile } = require("../controllers/authController");
const { authenticate } = require("../middlewares/authenticate");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/profile", authenticate, profile);

module.exports = router;
