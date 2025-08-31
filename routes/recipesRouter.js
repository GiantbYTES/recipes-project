const express = require("express");
const {
  getRecipes,
  getRecipeById,
  addRecipe,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipesController");

const { recipeValidation } = require("../middlewares/recipeValidation");

const router = express.Router();

router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.post("/", recipeValidation, addRecipe);
router.put("/:id", recipeValidation, updateRecipe);
router.delete("/:id", deleteRecipe);
// router.get("/stats", getRecipesStats);

module.exports = router;
