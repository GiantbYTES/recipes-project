const express = require("express");

const { authenticate } = require("../middlewares/authenticate");

const router = express.Router();

router.post("/:recipeId", authenticate, login);
router.delete("/:recipeId", authenticate, login);
router.get("/profile", authenticate, profile);

module.exports = router;
