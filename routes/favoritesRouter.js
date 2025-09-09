const express = require("express");
const {
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
} = require("../controllers/favoritesController");
const { authenticate } = require("../middlewares/authenticate");

const router = express.Router();

// GET /api/users/favorites - Get user's favorite recipes (Protected)
router.get("/", authenticate, getUserFavorites);

// POST /api/users/favorites/:recipeId - Add recipe to favorites (Protected)
router.post("/:recipeId", authenticate, addToFavorites);

// DELETE /api/users/favorites/:recipeId - Remove recipe from favorites (Protected)
router.delete("/:recipeId", authenticate, removeFromFavorites);

module.exports = router;
