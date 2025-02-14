import { Router } from "express";
import testController from "./controllers/testController";
import recipeRoutes from "./routes/recipeRoutes";

const router = Router();

router.use("/test", testController.testRoute);

router.use("/recipes", recipeRoutes);

export default router;
