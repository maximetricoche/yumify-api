import cors from "cors";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import testRoutes from "./routes/testRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/test", testRoutes);

app.use(errorHandler);

export default app;
