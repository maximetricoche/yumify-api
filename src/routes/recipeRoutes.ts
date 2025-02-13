import { Router } from "express";
import recipeController from "../controllers/recipeController";

const router = Router();

router.get("/", recipeController.browse);
router.get("/:id", recipeController.read);

export default router;
