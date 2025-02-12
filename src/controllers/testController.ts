import { RequestHandler } from "express";
import { STATUS } from "../utils/httpStatus";

const testRoute: RequestHandler = async (req, res, next) => {
  try {
    res.status(STATUS.OK).send("✅ L'API fonctionne correctement !");
  } catch (error) {
    next(error);
  }
};

export default { testRoute };
