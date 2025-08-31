const recipeModel = require("../models/recipeModel.js");

async function getRecipes(req, res) {
  let recipes = {};
  Object.keys(req.query).length > 0
    ? (recipes = await recipeModel.getFilteredRecipes(req.query))
    : (recipes = await recipeModel.getRecipes());
  res.status(200).json(recipes);
}

async function getRecipeById(req, res) {
  const recipe = await recipeModel.getRecipeById(req.params.id);
  recipe
    ? res.status(200).json(recipe)
    : res.status(404).json({ error: "Unknown note id" });
}

async function addRecipe(req, res) {
  const newRecipe = await recipeModel.addRecipe(req.body);
  res.status(201).json(newRecipe);
}

async function updateRecipe(req, res) {
  const updatedRecipe = await recipeModel.updateRecipe(req.params.id, req.body);
  updatedRecipe
    ? res.status(200).json(updatedRecipe)
    : res.status(404).json({ error: "Recipe not found" });
}
async function deleteRecipe(req, res) {
  const deletedRecipe = await recipeModel.deleteRecipe(req.params.id);
  deletedRecipe
    ? res.status(200).json(deletedRecipe)
    : res.status(404).json({ error: "Recipe not found" });
}

module.exports = {
  getRecipes,
  getRecipeById,
  addRecipe,
  updateRecipe,
  deleteRecipe,
};
