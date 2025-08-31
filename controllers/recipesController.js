const recipeModel = require("../models/recipeModel.js");
const {
  createError,
  asyncErrorHandler,
} = require("../middlewares/errorHandling.js");

const getRecipes = asyncErrorHandler(async (req, res) => {
  let recipes = {};
  Object.keys(req.query).length > 0
    ? (recipes = await recipeModel.getFilteredRecipes(req.query))
    : (recipes = await recipeModel.getRecipes());
  res.status(200).json(recipes);
});

const getRecipeById = asyncErrorHandler(async (req, res, next) => {
  const recipe = await recipeModel.getRecipeById(req.params.id);
  if (!recipe) {
    throw createError("Recipe not found", 404);
  }
  res.status(200).json(recipe);
});

const addRecipe = asyncErrorHandler(async (req, res) => {
  const newRecipe = await recipeModel.addRecipe(req.body);
  res.status(201).json(newRecipe);
});

const updateRecipe = asyncErrorHandler(async (req, res, next) => {
  const updatedRecipe = await recipeModel.updateRecipe(req.params.id, req.body);
  if (!updatedRecipe) {
    throw createError("Recipe not found", 404);
  }
  res.status(200).json(updatedRecipe);
});

const deleteRecipe = asyncErrorHandler(async (req, res, next) => {
  const deletedRecipe = await recipeModel.deleteRecipe(req.params.id);
  if (!deletedRecipe) {
    throw createError("Recipe not found", 404);
  }
  res.status(200).json(deletedRecipe);
});

const getRecipesStats = asyncErrorHandler(async (req, res) => {
  const recipesStats = await recipeModel.getRecipesStats();
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
