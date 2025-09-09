const { Sequelize } = require("sequelize");
// const { nanoid } = require("nanoid");
const { v4: uuidv4 } = require("uuid");
const { sequelize } = require("../db/models/index.js");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

async function getRecipes(userId) {
  const [results, metadata] = await sequelize.query(
    "SELECT * FROM recipes WHERE userId = :userId",
    {
      replacements: { userId },
    }
  );
  return results;
}

async function getFilteredRecipes(filter, userId) {
  // Filter by difficulty
  if (filter.difficulty) {
    const [results, metadata] = await sequelize.query(
      "SELECT * FROM recipes WHERE difficulty=:difficulty AND userId = :userId",
      { replacements: { difficulty: filter.difficulty, userId } }
    );
    return results;
  }

  // Filter by maxCookingTime
  if (filter.maxCookingTime) {
    const [results, metadata] = await sequelize.query(
      "SELECT * FROM recipes WHERE cookingTime<=:cookingTime AND userId = :userId",
      { replacements: { cookingTime: filter.maxCookingTime, userId } }
    );
    return results;
  }

  // Filter by search term
  if (filter.search) {
    const [results, metadata] = await sequelize.query(
      "SELECT * FROM recipes WHERE (title LIKE :search OR description LIKE :search) AND userId = :userId",
      { replacements: { search: `%${filter.search}%`, userId } }
    );
    return results;
  }
}

async function getRecipeById(id, userId) {
  const [results, metadata] = await sequelize.query(
    "SELECT * FROM recipes WHERE id=:id AND userId = :userId",
    { replacements: { id, userId } }
  );
  return results[0]; // Return single recipe object instead of array
}

async function addRecipe(newRecipe, userId, file) {
  try {
    const uploadResult = await cloudinary.uploader.upload(file.path);
    const query = `INSERT INTO recipes (title, description, ingredients, instructions, cookingTime, servings, difficulty, imageUrl, isPublic, userId, createdAt, updatedAt)
    VALUES (:title, :description, :ingredients, :instructions, :cookingTime, :servings, :difficulty, :imageUrl, :isPublic, :userId, NOW(), NOW())`;
    const [result] = await sequelize.query(query, {
      replacements: {
        title: newRecipe.title,
        description: newRecipe.description,
        ingredients: newRecipe.ingredients,
        instructions: newRecipe.instructions,
        cookingTime: newRecipe.cookingTime,
        servings: newRecipe.servings,
        difficulty: newRecipe.difficulty,
        imageUrl: uploadResult ? uploadResult.url : null,
        isPublic: newRecipe.isPublic,
        userId: userId,
      },
    });
    return getRecipeById(result.insertId, userId);
  } finally {
    file && fs.promises.unlink(file.path);
  }
}

async function updateRecipe(oldId, updatedData, userId) {
  const existingRecipe = await getRecipeById(oldId, userId);
  if (!existingRecipe) {
    throw new Error(`Recipe with id ${oldId} not found`);
  }

  // Build the UPDATE query dynamically based on provided fields
  const updateFields = [];
  const replacements = { id: oldId, userId: userId };

  if (updatedData.title !== undefined) {
    updateFields.push("title = :title");
    replacements.title = updatedData.title;
  }
  if (updatedData.description !== undefined) {
    updateFields.push("description = :description");
    replacements.description = updatedData.description;
  }
  if (updatedData.ingredients !== undefined) {
    updateFields.push("ingredients = :ingredients");
    replacements.ingredients = updatedData.ingredients;
  }
  if (updatedData.instructions !== undefined) {
    updateFields.push("instructions = :instructions");
    replacements.instructions = updatedData.instructions;
  }
  if (updatedData.cookingTime !== undefined) {
    updateFields.push("cookingTime = :cookingTime");
    replacements.cookingTime = updatedData.cookingTime;
  }
  if (updatedData.servings !== undefined) {
    updateFields.push("servings = :servings");
    replacements.servings = updatedData.servings;
  }
  if (updatedData.difficulty !== undefined) {
    updateFields.push("difficulty = :difficulty");
    replacements.difficulty = updatedData.difficulty;
  }
  if (updatedData.imageUrl !== undefined) {
    updateFields.push("imageUrl = :imageUrl");
    replacements.imageUrl = updatedData.imageUrl;
  }
  if (updatedData.isPublic !== undefined) {
    updateFields.push("isPublic = :isPublic");
    replacements.isPublic = updatedData.isPublic;
  }

  // Always update the updatedAt timestamp
  updateFields.push("updatedAt = NOW()");

  if (updateFields.length === 1) {
    // Only updatedAt field
    throw new Error("No fields provided for update");
  }

  const query = `UPDATE recipes SET ${updateFields.join(
    ", "
  )} WHERE id = :id AND userId = :userId`;

  await sequelize.query(query, { replacements });

  // Return the updated recipe
  return await getRecipeById(oldId, userId);
}

async function deleteRecipe(id, userId) {
  // First check if the recipe exists and belongs to the user
  const existingRecipe = await getRecipeById(id, userId);
  if (!existingRecipe) {
    throw new Error(`Recipe with id ${id} not found`);
  }

  const query = "DELETE FROM recipes WHERE id = :id AND userId = :userId";
  await sequelize.query(query, { replacements: { id, userId } });

  return existingRecipe; // Return the deleted recipe data
}

async function getRecipesStats(userId) {
  const recipes = await getRecipes(userId);
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
