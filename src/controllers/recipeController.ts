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

export default { browse };
