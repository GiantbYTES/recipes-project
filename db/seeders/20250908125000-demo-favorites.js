"use strict";

const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Note: You'll need to make sure you have users and recipes in your database first
    await queryInterface.bulkInsert("userfavorites", [
      {
        id: uuidv4(),
        userId: "1", // Replace with actual user ID from your users table
        recipeId: "recipe-001", // Replace with actual recipe ID from your recipes table
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: "1", // Replace with actual user ID from your users table
        recipeId: "recipe-002", // Replace with actual recipe ID from your recipes table
        createdAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("userfavorites", null, {});
  },
};
