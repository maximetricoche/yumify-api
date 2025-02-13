import { RequestHandler } from "express";
import { STATUS } from "../utils/httpStatus";

import recipeService from "../services/recipeService";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const recipes = await recipeService.getAllRecipes(Number(userId));

    if (!recipes || recipes.length === 0) {
      res.status(STATUS.NOT_FOUND).json({ message: "Aucune recette trouvée" });
      return;
    }
    res.status(STATUS.OK).json(recipes);
  } catch (error) {
    next(error);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const recipe = await recipeService.getRecipe(Number(id), Number(userId));

    if (!recipe || recipe.length === 0) {
      res.status(STATUS.NOT_FOUND).json({ message: "Recette introuvable" });
      return;
    }
    res.status(STATUS.OK).json(recipe);
  } catch (error) {
    next(error);
  }
};

const edit: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { updatedData } = req.body;

    if (!id || !updatedData) {
      res.status(STATUS.BAD_REQUEST).json({ message: "Données manquantes" });
      return;
    }

    const modifications = await recipeService.updateRecipe(Number(id), updatedData);

    res.status(STATUS.OK).json({ message: "Mise à jour effectuée", modifications });
  } catch (error) {
    next(error);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const { title, prepTime, cookTime, category, ingredients, steps, userId } = req.body;

    if (!title || !prepTime || !cookTime || !category || !ingredients || !steps || !userId) {
      res.status(STATUS.BAD_REQUEST).json({ message: "Données manquantes" });
      return;
    }

    const newRecipeId = await recipeService.addRecipe({ title, prepTime, cookTime, category, userId });

    await recipeService.addIngredients(newRecipeId, ingredients);

    await recipeService.addSteps(newRecipeId, steps);

    res.status(STATUS.CREATED).json({ message: "Recette ajoutée", newRecipeId });
  } catch (error) {
    next(error);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(STATUS.BAD_REQUEST).json({ message: "Données manquantes" });
      return;
    }

    const result = await recipeService.deleteRecipe(Number(id));

    if (!result || result === 0) {
      res.status(STATUS.NOT_FOUND).json({ message: "Recette introuvable" });
      return;
    }

    res.status(STATUS.OK).json({ message: "Recette supprimée", result });
  } catch (error) {
    next(error);
  }
};

export default { browse, read, edit, add, destroy };
