import { RequestHandler } from "express";
import { createError } from "../middlewares/errorHandler";
import { RecipeDTO, RecipeSummaryDTO } from "../types/recipe.dto";
import { STATUS } from "../utils/httpStatus";

import db from "../configs/database";
import recipeService from "../services/recipeService";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number.parseInt(req.body.userId);

    if (!userId) {
      return next(createError(STATUS.BAD_REQUEST, "L'ID de l'utilisateur est manquant"));
    }

    const recipes: RecipeSummaryDTO[] = await recipeService.getAllRecipes(userId);

    res.status(STATUS.OK).json(recipes);
  } catch (error) {
    next(error);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const recipeId = Number.parseInt(req.params.id);
    const userId = Number.parseInt(req.body.userId);

    if (!recipeId || !userId) {
      return next(createError(STATUS.BAD_REQUEST, "L'ID de l'utilisateur ou de la recette sont requis"));
    }

    const recipe: RecipeDTO = await recipeService.getRecipe(recipeId, userId);

    res.status(STATUS.OK).json(recipe);
  } catch (error) {
    next(error);
  }
};

const edit: RequestHandler = async (req, res, next) => {
  const connection = await db.getConnection();

  try {
    const recipeId = Number.parseInt(req.params.id);
    const updatedData = req.body;

    if (!recipeId || !updatedData) {
      return next(createError(STATUS.BAD_REQUEST, "ID de la recette ou données manquantes"));
    }

    const updatedRecipe = await recipeService.updateRecipe(connection, recipeId, updatedData);
    // FIXME: Est ce qu'on renvoit vraiment la recette modifiée ?
    res.status(STATUS.OK).json({ message: "Mise à jour effectuée", updatedRecipe });
  } catch (error) {
    next(error);
  }
};

const add: RequestHandler = async (req, res, next) => {
  const connection = await db.getConnection();

  try {
    const newRecipe: RecipeDTO = req.body;

    if (!newRecipe.title || !newRecipe.prepTime || !newRecipe.cookTime || !newRecipe.category || !newRecipe.ingredients || !newRecipe.steps || !newRecipe.userId) {
      return next(createError(STATUS.BAD_REQUEST, "Données manquantes"));
    }

    const newRecipeId = await recipeService.addRecipe(connection, newRecipe);

    res.status(STATUS.CREATED).json({ message: "Recette ajoutée", newRecipeId });
  } catch (error) {
    next(error);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    const recipeId = Number.parseInt(req.params.id);

    if (!recipeId) {
      throw createError(STATUS.BAD_REQUEST, "ID de la recette manquant");
    }

    const result = await recipeService.deleteRecipe(recipeId);

    res.status(STATUS.OK).json({ message: "Recette supprimée", result });
  } catch (error) {
    next(error);
  }
};

export default { browse, read, edit, add, destroy };
