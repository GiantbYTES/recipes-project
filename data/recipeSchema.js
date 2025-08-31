const recipeSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    description: { type: "string" },
    ingredients: { type: "array", items: { type: "string" }, minItems: 1 },
    instructions: { type: "array", items: { type: "string" }, minItems: 1 },
    cookingTime: { type: "integer", minimum: 1 },
    servings: { type: "integer", minimum: 1 },
    difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
    rating: { type: "number", minimum: 1, maximum: 5 },
    createdAt: { type: "string", format: "date-time" },
  },
  required: [
    "title",
    "description",
    "ingredients",
    "instructions",
    "cookingTime",
    "servings",
    "difficulty",
    "rating",
  ],
  additionalProperties: false,
};
module.exports = { recipeSchema };
