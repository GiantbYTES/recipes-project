const fs = require("fs");
const { nanoid } = require("nanoid");

async function getRecipes() {
  const data = await fs.promises.readFile("./data/recipes.json");
  return JSON.parse(data);
}
async function getFilteredRecipes(filter) {
  const data = await fs.promises.readFile("./data/recipes.json");
  let filteredRecipes = JSON.parse(data);

  // Filter by difficulty
  if (filter.difficulty) {
    filteredRecipes = filteredRecipes.filter(
      (recipe) => recipe.difficulty === filter.difficulty
    );
  }

  // Filter by maxCookingTime
  if (filter.maxCookingTime) {
    filteredRecipes = filteredRecipes.filter(
      (recipe) => recipe.cookingTime <= Number(filter.maxCookingTime)
    );
  }

  // Filter by search term
  if (filter.search) {
    const searchTerm = filter.search.toLowerCase();
    filteredRecipes = filteredRecipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(searchTerm) ||
        recipe.description.toLowerCase().includes(searchTerm)
    );
  }

  return filteredRecipes;
}

async function getRecipeById(id) {
  const recipes = await getRecipes();
  const recipe = recipes.find((recipe) => recipe.id === id);
  return recipe;
}

module.exports = { getRecipes, getFilteredRecipes, getRecipeById };
