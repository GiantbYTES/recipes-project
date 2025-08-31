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
  recipes.push(newRecipe);
  await fs.promises.writeFile("./data/recipes.json", JSON.stringify(recipes));
  return newRecipe;
}

async function updateRecipe(oldId, updatedData) {
  const existingRecipe = await getRecipeById(oldId);
  const recipes = await getRecipes();
  const recipeIndex = recipes.findIndex((recipe) => recipe.id === oldId);
  const updatedRecipe = {
    ...existingRecipe,
    ...updatedData,
    id: oldId,
    createdAt: new Date(),
  };
  recipes[recipeIndex] = updatedRecipe;
  await fs.promises.writeFile("./data/recipes.json", JSON.stringify(recipes));
  return updatedRecipe;
}

async function deleteRecipe(id) {
  const toDelete = await getRecipeById(id);
  const recipes = await getRecipes();
  const recipeIndex = recipes.findIndex((recipe) => recipe.id === id);
  recipes.splice(recipeIndex, 1);
  await fs.promises.writeFile("./data/recipes.json", JSON.stringify(recipes));
  return toDelete;
}

async function getRecipesStats() {
  const recipes = await getRecipes();
  const toReturn = {};
  toReturn.totalNumOfRecipes = recipes.length;
  toReturn.averageCookingTime = calcAverageCookingTime(recipes);
  toReturn.recipeByDifficulty = recipesByDiffLevel(recipes);
  return toReturn;
}

function calcAverageCookingTime(recipes) {
  const totalTime = recipes.reduce((sum, recipe) => {
    return sum + Number(recipe.cookingTime);
  }, 0);
  return totalTime / recipes.length;
}

function recipesByDiffLevel(recipes) {
  const toReturn = { easy: 0, medium: 0, hard: 0 };
  recipes.forEach((recipe) => {
    if (recipe.difficulty === "easy") {
      toReturn.easy++;
    } else if (recipe.difficulty === "medium") {
      toReturn.medium++;
    } else if (recipe.difficulty === "hard") {
      toReturn.hard++;
    }
  });
  return toReturn;
}

module.exports = {
  getRecipes,
  getFilteredRecipes,
  getRecipeById,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipesStats,
};
