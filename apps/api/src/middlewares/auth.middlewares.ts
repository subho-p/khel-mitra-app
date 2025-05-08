import express from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env.config.js";
import db from "@khel-mitra/db";
import { eq } from "@khel-mitra/db/drizzle";
import { userTable } from "@khel-mitra/db/schemas";

declare global {
	namespace Express {
		interface Request {
			currentUser?: any;
		}
	}
}

export const verifyToken = async (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	try {
		// from headers authorization bearer token or from cookies
		const token = req.headers.authorization?.split(" ")[1] || req.cookies.access_token;

		if (!token) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		// verify token
		const payload: any = jwt.verify(token, config.get("JWT_SECRET") as string);
		if (!payload || !payload.userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		// set user id to req.user
		const user = await db.query.userTable.findFirst({
			where: eq(userTable.id, payload.userId),
			with: {
				avatar: true,
			},
		});

		if (!user) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const userWithAvatar = { ...user, avatar: user.avatar?.url || null };
		req.currentUser = userWithAvatar;

		next();
	} catch (error) {
		throw error;
	}
};
