const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const { recipeSchema } = require("../data/recipeSchema");

const ajv = new Ajv();
addFormats(ajv);
const validateRecipe = ajv.compile(recipeSchema);

function recipeValidation(req, res, next) {
  const valid = validateRecipe(req.body);
  if (valid) {
    next();
  } else {
    console.log(validateRecipe.errors);
    const error = new Error("Recipe validation error");
    error.status = 400;
    error.message = validateRecipe.errors[0].message;
    next(error);
  }
}

module.exports = { recipeValidation };
