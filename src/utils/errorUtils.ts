import { createError } from "../middlewares/errorHandler";
import { STATUS } from "../utils/httpStatus";

export const handleError = (error: any, customMessage: string) => {
  console.error("❌", customMessage, error);

  return createError(error.status || STATUS.INTERNAL_SERVER_ERROR, customMessage || "Une erreur est survenue", error.stack || undefined);
};
