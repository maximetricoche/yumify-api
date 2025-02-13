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

export default { getAllRecipes, getRecipe };
