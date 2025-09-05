const authModel = require("../models/authModel.js");
const jwt = require("jsonwebtoken");

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      next({ status: 400, message: "email or password missing" });
    }
    const user = await authModel.login(email, password);
    if (!user) {
      next({ status: 401, message: "invalid email or password" });
    }
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "24h" });
    res.status(200).json({ token, user });
  } catch (err) {
    next({ status: 401, message: err });
  }
}

async function register(req, res, next) {
  try {
    const { email, password, username, firstName, lastName } = req.body;
    if (!email || !password || !username || !firstName || !lastName) {
      next({ status: 400, message: "missing data" });
    }
    console.log("before register in model");
    const success = await authModel.register(
      email,
      password,
      username,
      firstName,
      lastName
    );
    console.log("after register in model");
    if (!success) {
      next({ status: 401, message: "invalid data" });
    }
    res.status(200).json({ success });
  } catch (err) {
    next({ status: 401, message: err });
  }
}

module.exports = { login, register };
