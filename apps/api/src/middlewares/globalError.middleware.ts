import { logger } from "@khel-mitra/shared/utils/logger";
import { NextFunction, Request, Response } from "express";

export const globalErrorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    const reqMethod = req.method;
    const reqUrl = req.url.replace("/api", "");
    logger.error(`[${reqMethod} ${reqUrl}] ${err?.message}`);

    res.status(err.status || 500).json({ message: err.message || "Something went wrong" });
};