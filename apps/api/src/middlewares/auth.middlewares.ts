import express from "express";
import passport from "passport";
import { UnauthorizedError } from "utils/error-response";

export const verifyToken = async (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	passport.authenticate("jwt", { session: false }, async (err: any, user: any, info: any) => {
		if (err || !user) {
			throw new UnauthorizedError(info?.message || "Unauthorized");
		}

		req.user = user;

		next();
	});
};
