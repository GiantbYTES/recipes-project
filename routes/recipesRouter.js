const express = require("express");
const {
  getRecipes,
  getRecipeById,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipesStats,
} = require("../controllers/recipesController");
const { authenticate } = require("../middlewares/authenticate");
const { recipeValidation } = require("../middlewares/recipeValidation");

const multer = require("multer");
const upload = multer({ dest: "public/" });

const router = express.Router();

// Add authentication to routes that need user-specific access
router.get("/", authenticate, getRecipes);
router.get("/stats", authenticate, getRecipesStats);
router.get("/:id", authenticate, getRecipeById);
router.post(
  "/",
  authenticate,
  upload.single("image"),
  recipeValidation,
  addRecipe
);
router.put("/:id", authenticate, recipeValidation, updateRecipe);
router.delete("/:id", authenticate, deleteRecipe);

module.exports = router;
