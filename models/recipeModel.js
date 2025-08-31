const fs = require("fs");
// const { nanoid } = require("nanoid");
const { v4: uuidv4 } = require("uuid");

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

async function addRecipe(newRecipe) {
  const recipes = await getRecipes();
  newRecipe.id = uuidv4();
  newRecipe.createdAt = new Date();
  // No need to parse - ingredients and instructions are already arrays from JSON
  recipes.push(newRecipe);
  await fs.promises.writeFile("./data/recipes.json", JSON.stringify(recipes));
  return newRecipe;
}

module.exports = { getRecipes, getFilteredRecipes, getRecipeById, addRecipe };
