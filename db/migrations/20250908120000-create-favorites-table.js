"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("userFavorites", {
      id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      recipeId: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        references: {
          model: "recipes",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
    });

    await queryInterface.bulkDelete("userFavorites", {});

    // Add userId column to userFavorites table
    await queryInterface.addColumn("userFavorites", "userId", {
      type: Sequelize.CHAR(36),
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    // Add recipeId column to userFavorites table
    await queryInterface.addColumn("userFavorites", "recipeId", {
      type: Sequelize.CHAR(36),
      allowNull: false,
      references: {
        model: "recipes",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("userFavorites", "userId");
    await queryInterface.removeColumn("userFavorites", "recipeId");
    await queryInterface.dropTable("userFavorites");
  },
};
