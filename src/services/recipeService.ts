import recipeModel from "../models/recipeModel";

const getAllRecipes = async (userId: number) => {
  try {
    const recipes = await recipeModel.readAll(userId);

    return recipes;
  } catch (error) {
    console.error("Erreur lors de la récupération des recettes", error);
    throw error;
  }
};

const getRecipe = async (recipeId: number, userId: number) => {
  try {
    const recipe = await recipeModel.read(recipeId, userId);

    return recipe;
  } catch (error) {
    console.error("Erreur lors de la récupération de la recette", error);
    throw error;
  }
};

const updateRecipe = async (
  recipeId: number,
  updatedData: {
    title: string;
    prepTime: number;
    cookTime: number;
    category: string;
    ingredients: { id: number; name: string; quantity: number; unit: string }[];
    steps: { stepNumber: number; description: string }[];
  },
) => {
  const modifications = {
    recipeUpdated: false,
    ingredientsUpdated: false,
    stepsUpdated: false,
  };

  try {
    const recipeResult = await recipeModel.updateRecipe(recipeId, updatedData);
    if (recipeResult > 0) {
      modifications.recipeUpdated = true;
    }

    const ingredientsResult = await recipeModel.updateIngredients(recipeId, updatedData.ingredients);
    if (ingredientsResult && ingredientsResult > 0) {
      modifications.ingredientsUpdated = true;
    }

    const stepsResult = await recipeModel.updateSteps(recipeId, updatedData.steps);
    if (stepsResult && stepsResult > 0) {
      modifications.stepsUpdated = true;
    }

    return modifications;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la recette", error);
    throw error;
  }
};

export default { getAllRecipes, getRecipe, updateRecipe };
