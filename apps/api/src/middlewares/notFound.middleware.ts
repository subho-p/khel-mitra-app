import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../utils/error-response";
import { logger } from "@khel-mitra/logger";

export const notFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const reqMethod = req.method;
	const reqUrl = req.url.replace("/api", "");
	logger.error(`[${reqMethod} ${reqUrl}] Route not found`);
	throw new NotFoundError(`[${reqMethod} ${reqUrl}] Route not found`);
};
