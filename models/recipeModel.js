const fs = require("fs");
const { nanoid } = require("nanoid");

async function getRecipes() {
  const data = await fs.promises.readFile("./data/recipes.json");
  return JSON.parse(data);
}

async function getRecipeById(id) {
  const recipes = getRecipes();
  const recipe = recipes.find((recipe) => recipe.id === id);
  return recipe;
}

module.exports = { getRecipes, getRecipeById };
