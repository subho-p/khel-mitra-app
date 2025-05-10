import { userTable } from "@khel-mitra/db/schemas";
import express from "express";
import passport from "passport";
import { UnauthorizedError } from "utils/error-response";

declare global {
	namespace Express {
		interface Request {
			currentUser?: typeof userTable.$inferSelect;
		}
	}
}

export const verifyToken = async (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	passport.authenticate("jwt", { session: false }, async (err: any, user: any, info: any) => {
		if (err || !user) {
			return next(new UnauthorizedError(info?.message || "Unauthorized"));
		}

		req.user = user;
		req.currentUser = user;

		next();
	})(req, res, next);
};
