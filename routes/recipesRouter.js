const express = require("express");
const {
  getRecipes,
  getRecipeById,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipesStats,
} = require("../controllers/recipesController");

const { recipeValidation } = require("../middlewares/recipeValidation");

const router = express.Router();

router.get("/", getRecipes);
router.get("/stats", getRecipesStats);
router.get("/:id", getRecipeById);
router.post("/", recipeValidation, addRecipe);
router.put("/:id", recipeValidation, updateRecipe);
router.delete("/:id", deleteRecipe);

module.exports = router;
