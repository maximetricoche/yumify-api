import { Router } from "express";
import recipeController from "../controllers/recipeController";

const router = Router();

router.get("/", recipeController.browse);

export default router;
