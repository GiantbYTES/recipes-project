const recipeModel = require("../models/recipeModel.js");
const {
  createError,
  asyncErrorHandler,
} = require("../middlewares/errorHandling.js");

const getRecipes = asyncErrorHandler(async (req, res) => {
  let recipes = {};
  Object.keys(req.query).length > 0
    ? (recipes = await recipeModel.getFilteredRecipes(req.query, req.user.id))
    : (recipes = await recipeModel.getRecipes(req.user.id));
  res.status(200).json(recipes);
});

const getRecipeById = asyncErrorHandler(async (req, res, next) => {
  const recipe = await recipeModel.getRecipeById(req.params.id, req.user.id);
  if (!recipe) {
    throw createError("Recipe not found", 404);
  }
  res.status(200).json(recipe);
});

const addRecipe = asyncErrorHandler(async (req, res) => {
  const newRecipe = await recipeModel.addRecipe(
    req.body,
    req.user.id,
    req.file
  );
  res.status(201).json(newRecipe);
});

const updateRecipe = asyncErrorHandler(async (req, res, next) => {
  try {
    const updatedRecipe = await recipeModel.updateRecipe(
      req.params.id,
      req.body,
      req.user.id
    );
    res.status(200).json(updatedRecipe);
  } catch (error) {
    if (error.message.includes("not found")) {
      throw createError(error.message, 404);
    }
    if (error.message.includes("No fields provided")) {
      throw createError(error.message, 400);
    }
    throw error;
  }
});

const deleteRecipe = asyncErrorHandler(async (req, res, next) => {
  try {
    const deletedRecipe = await recipeModel.deleteRecipe(
      req.params.id,
      req.user.id
    );
    res.status(200).json(deletedRecipe);
  } catch (error) {
    if (error.message.includes("not found")) {
      throw createError(error.message, 404);
    }
    throw error;
  }
});

const getRecipesStats = asyncErrorHandler(async (req, res) => {
  const recipesStats = await recipeModel.getRecipesStats(req.user.id);
  res.status(200).json(recipesStats);
});

module.exports = {
  getRecipes,
  getRecipeById,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipesStats,
};
