"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("recipes", {
      id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
      },
      ingredients: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      instructions: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      cookingTime: {
        type: Sequelize.INTEGER,
      },
      servings: {
        type: Sequelize.INTEGER,
      },
      difficulty: {
        type: Sequelize.ENUM("easy", "medium", "hard"),
      },
      imageUrl: {
        type: Sequelize.STRING(255),
      },
      isPublic: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("recipes");
  },
};
