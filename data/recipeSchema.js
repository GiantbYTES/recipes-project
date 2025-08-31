const recipeSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    title: { type: "string", minLength: 3, maxLength: 100 },
    description: { type: "string", minLength: 10, maxLength: 500 },
    ingredients: {
      type: "array",
      items: { type: "string", minLength: 1 },
      minItems: 1,
    },
    instructions: {
      type: "array",
      items: { type: "string", minLength: 1 },
      minItems: 1,
    },
    cookingTime: { type: "integer", exclusiveMinimum: 0 },
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
