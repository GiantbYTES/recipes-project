const express = require("express");
const {
  getRecipes,
  getRecipeById,
  addRecipe,
} = require("../controllers/recipesController");

const { recipeValidation } = require("../middlewares/recipeValidation");

const router = express.Router();

router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.post("/", recipeValidation, addRecipe);
// router.put("/:id", getRecipeById, recipeValidation, updateRecipe);
// router.delete("/:id", getRecipeById);
// router.get("/stats", getRecipesStats);

module.exports = router;
