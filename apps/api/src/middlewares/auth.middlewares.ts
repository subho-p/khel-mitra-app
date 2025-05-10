import express from "express";
import passport from "passport";

export const verifyToken = async (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	passport.authenticate("jwt", { session: false }, async (err: any, user: any, info: any) => {
		if (err) {
			return res.status(500).json({ message: "Authentication error", error: err });
		}
		if (!user) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		req.user = user;

		next();
	});
};
