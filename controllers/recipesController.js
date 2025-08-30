const recipeModel = require("../models/recipeModel.js");

async function getRecipes(req, res) {
  const recipes = await recipeModel.getRecipes();
  res.status(200).json(recipes);
}

async function getRecipeById(req, res) {
  const recipe = await recipeModel.getRecipeById(req.params.id);
  recipe
    ? res.status(200).json(recipe)
    : res.status(404).json({ error: "Unknown note id" });
}

module.exports = { getRecipes, getRecipeById };
