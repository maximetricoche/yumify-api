import { Router } from "express";
import recipeController from "../controllers/recipeController";

const router = Router();

router.get("/", recipeController.browse);
router.get("/:id", recipeController.read);
router.put("/:id", recipeController.edit);

export default router;
