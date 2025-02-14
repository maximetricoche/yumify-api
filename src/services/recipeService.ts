import type { ConnectionDB } from "../configs/database";
import { createError } from "../middlewares/errorHandler";
import recipeModel from "../models/recipeModel";
import { RecipeDTO, RecipeSummaryDTO } from "../types/recipe.dto";
import { handleError } from "../utils/errorUtils";
import { STATUS } from "../utils/httpStatus";

const getAllRecipes = async (userId: number): Promise<RecipeSummaryDTO[]> => {
  try {
    const recipes = await recipeModel.readAll(userId);

    if (!recipes || recipes.length === 0) {
      throw createError(STATUS.NOT_FOUND, "Aucune recette trouvée");
    }

    return recipes;
  } catch (error) {
    throw handleError(error, "Erreur lors de la récupération de toutes les recettes");
  }
};

const getRecipe = async (recipeId: number, userId: number): Promise<RecipeDTO> => {
  try {
    const recipe = await recipeModel.read(recipeId, userId);

    if (!recipe) {
      throw createError(STATUS.NOT_FOUND, "Recette introuvable");
    }

    return recipe;
  } catch (error) {
    throw handleError(error, "Erreur lors de la récupération de la recette");
  }
};

const updateRecipe = async (connection: ConnectionDB, recipeId: number, updatedData: RecipeDTO): Promise<void> => {
  try {
    await connection.beginTransaction();

    const recipeResult = await recipeModel.updateRecipe(connection, recipeId, updatedData);

    if (recipeResult.affectedRows === 0) {
      throw createError(STATUS.NOT_FOUND, "Recette introuvable");
    }

    const ingredientsResult = await recipeModel.updateIngredients(connection, recipeId, updatedData.ingredients);

    if (ingredientsResult.affectedRows === 0) {
      throw createError(STATUS.NOT_FOUND, "Ingrédients introuvables");
    }

    const stepsResult = await recipeModel.updateSteps(connection, recipeId, updatedData.steps);

    if (stepsResult.affectedRows === 0) {
      throw createError(STATUS.NOT_FOUND, "Étapes introuvables");
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw handleError(error, "Erreur lors de la mise à jour de la recette");
  }
};

const addRecipe = async (connection: ConnectionDB, newRecipe: RecipeDTO): Promise<number> => {
  try {
    await connection.beginTransaction();

    const newRecipeId = await recipeModel.createRecipe(connection, newRecipe);

    await recipeModel.addIngredients(connection, newRecipeId, newRecipe.ingredients);
    await recipeModel.addSteps(connection, newRecipeId, newRecipe.steps);

    await connection.commit();
    return newRecipeId;
  } catch (error) {
    await connection.rollback();
    throw handleError(error, "Erreur lors de l'ajout de la recette");
  }
};

const deleteRecipe = async (recipeId: number): Promise<any> => {
  try {
    const result = await recipeModel.deleteRecipe(recipeId);
    console.log(result);

    if (!result || result.affectedRows === 0) {
      throw createError(STATUS.NOT_FOUND, "Recette introuvable");
    }

    return result;
  } catch (error) {
    throw handleError(error, "Erreur lors de la suppression de la recette");
  }
};

export default { getAllRecipes, getRecipe, updateRecipe, addRecipe, deleteRecipe };
