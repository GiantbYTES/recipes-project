const favoritesModel = require("../models/favoritesModel.js");
const {
  createError,
  asyncErrorHandler,
} = require("../middlewares/errorHandling.js");

// GET /api/users/favorites - Get user's favorite recipes
const getUserFavorites = asyncErrorHandler(async (req, res) => {
  const favorites = await favoritesModel.getUserFavorites(req.user.id);
  res.status(200).json({
    success: true,
    count: favorites.length,
    data: favorites,
  });
});

// POST /api/users/favorites/:recipeId - Add recipe to user's favorites
const addToFavorites = asyncErrorHandler(async (req, res) => {
  try {
    const favoriteRecipe = await favoritesModel.addToFavorites(
      req.user.id,
      req.params.recipeId
    );
    res.status(201).json({
      success: true,
      message: "Recipe added to favorites",
      data: favoriteRecipe,
    });
  } catch (error) {
    if (error.message === "Recipe not found") {
      throw createError("Recipe not found", 404);
    }
    if (error.message === "Recipe already in favorites") {
      throw createError("Recipe already in favorites", 409);
    }
    throw error;
  }
});

// DELETE /api/users/favorites/:recipeId - Remove recipe from favorites
const removeFromFavorites = asyncErrorHandler(async (req, res) => {
  try {
    const removedFavorite = await favoritesModel.removeFromFavorites(
      req.user.id,
      req.params.recipeId
    );
    res.status(200).json({
      success: true,
      message: "Recipe removed from favorites",
      data: removedFavorite,
    });
  } catch (error) {
    if (error.message === "Recipe not found in favorites") {
      throw createError("Recipe not found in favorites", 404);
    }
    throw error;
  }
});

module.exports = {
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
};
