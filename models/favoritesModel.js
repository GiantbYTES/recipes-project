const { Sequelize } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const { sequelize } = require("../db/models/index.js");

// Get all favorite recipes for a user
async function getUserFavorites(userId) {
  const [results, metadata] = await sequelize.query(
    `
    SELECT r.*, uf.createdAt as favoriteAddedAt 
    FROM userfavorites uf 
    JOIN recipes r ON uf.recipeId = r.id 
    WHERE uf.userId = :userId
    ORDER BY uf.createdAt DESC
  `,
    {
      replacements: { userId },
    }
  );
  return results;
}

// Add a recipe to user's favorites
async function addToFavorites(userId, recipeId) {
  // First check if the recipe exists
  const [recipeExists] = await sequelize.query(
    "SELECT id FROM recipes WHERE id = :recipeId",
    { replacements: { recipeId } }
  );

  if (recipeExists.length === 0) {
    throw new Error("Recipe not found");
  }

  // Check if already in favorites
  const [existingFavorite] = await sequelize.query(
    "SELECT id FROM userfavorites WHERE userId = :userId AND recipeId = :recipeId",
    { replacements: { userId, recipeId } }
  );

  if (existingFavorite.length > 0) {
    throw new Error("Recipe already in favorites");
  }

  // Add to favorites
  const favoriteId = uuidv4();
  await sequelize.query(
    `
    INSERT INTO userfavorites (id, userId, recipeId, createdAt) 
    VALUES (:id, :userId, :recipeId, NOW())
  `,
    {
      replacements: { id: favoriteId, userId, recipeId },
    }
  );

  // Return the recipe with favorite info
  const [result] = await sequelize.query(
    `
    SELECT r.*, uf.createdAt as favoriteAddedAt 
    FROM userfavorites uf 
    JOIN recipes r ON uf.recipeId = r.id 
    WHERE uf.userId = :userId AND uf.recipeId = :recipeId
  `,
    {
      replacements: { userId, recipeId },
    }
  );

  return result[0];
}

// Remove a recipe from user's favorites
async function removeFromFavorites(userId, recipeId) {
  // Check if the favorite exists
  const [existingFavorite] = await sequelize.query(
    "SELECT * FROM userfavorites WHERE userId = :userId AND recipeId = :recipeId",
    { replacements: { userId, recipeId } }
  );

  if (existingFavorite.length === 0) {
    throw new Error("Recipe not found in favorites");
  }

  // Remove from favorites
  await sequelize.query(
    "DELETE FROM userfavorites WHERE userId = :userId AND recipeId = :recipeId",
    { replacements: { userId, recipeId } }
  );

  return existingFavorite[0];
}

// Check if a recipe is in user's favorites
async function isFavorite(userId, recipeId) {
  const [result] = await sequelize.query(
    "SELECT id FROM userfavorites WHERE userId = :userId AND recipeId = :recipeId",
    { replacements: { userId, recipeId } }
  );

  return result.length > 0;
}

module.exports = {
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
};
