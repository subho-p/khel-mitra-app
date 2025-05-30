import express from "express";
import * as argon from "argon2";
import jwt from "jsonwebtoken";

import { userTable } from "@khel-mitra/db/schemas";
import { signInSchema, signUpSchema } from "@khel-mitra/shared/schemas";
import { logger } from "@khel-mitra/logger";

import { config } from "../config/env.config.js";
import { UserService } from "../services/user.service.js";

import passport from "passport";
import {
	BadRequestError,
	ConflictError,
	InternalServerError,
	NotFoundError,
	UnauthorizedError,
} from "../utils/error-response.js";
import { zodValidation } from "../utils/zod-validation.js";
import { jwtService } from "../services/jwt.service.js";

class AuthController {
	private userService = new UserService();
	constructor() {
		logger.info("AuthController initialized");

		this.signUp = this.signUp.bind(this);
		this.signIn = this.signIn.bind(this);
		this.signOut = this.signOut.bind(this);
		this.refresh = this.refresh.bind(this);
	}

	public async signUp(req: express.Request, res: express.Response, next: express.NextFunction) {
		try {
			const { email, password } = zodValidation(signUpSchema, req.body);

			const existsUser = await this.userService.isUserAlreadyExists(email);
			if (existsUser) {
				throw new ConflictError("User already exists");
			}

			const newUser = await this.userService.createUser(email);
			if (!newUser) {
				throw new InternalServerError("Failed to create user");
			}

			const hashedPassword = await argon.hash(password);
			await this.userService.insertUserCredentials(newUser.id, hashedPassword);

			const tokens = this.generateTokens(newUser);
			this.setCookie(res, tokens);

			logger.info("User signed up successfully", { id: newUser.id });

			return res.status(201).json({
				data: { accessToken: tokens.accessToken },
				message: "User signed up successfully",
			});
		} catch (error: any) {
			next(error);
		}
	}

	public async signIn(req: express.Request, res: express.Response, next: express.NextFunction) {
		try {
			const { emailOrUsername, password } = zodValidation(signInSchema, req.body);

			passport.authenticate(
				"local",
				{ session: false },
				async (err: any, user: any, info: any) => {
					if (err || !user) {
						logger.error(err);
						return next(new BadRequestError(info?.message || "Invalid credentials"));
					}

					logger.info("User signed in successfully", { id: user.id });
					req.logIn(user, { session: false }, async (loginErr) => {
						if (loginErr) {
							logger.error(loginErr);
							return next(loginErr);
						}

						const tokens = this.generateTokens(user);
						this.setCookie(res, tokens);

						logger.info("User signed in successfully", { id: user.id });
						return res.status(200).json({
							data: { accessToken: tokens.accessToken },
							message: "User signed in successfully",
						});
					});
				}
			)(req, res, next);
		} catch (error) {
			next(error);
		}
	}
	public async signOut(req: express.Request, res: express.Response) {
		try {
			// For Passport session-based auth (optional)
			if (req.isAuthenticated && req.isAuthenticated()) {
				req.logout((err) => {
					if (err) {
						throw new InternalServerError("Error during logout");
					}
				});
			}

			// Clear JWT cookies
			res.clearCookie("access_token", { httpOnly: true, secure: true, sameSite: "strict" });
			res.clearCookie("refresh_token", { httpOnly: true, secure: true, sameSite: "strict" });

			return res.status(200).json({ message: "User signed out successfully" });
		} catch (error) {
			throw new InternalServerError("Error during logout");
		}
	}

	public async refresh(req: express.Request, res: express.Response, next: express.NextFunction) {
		try {
			const refreshToken = req.cookies.refresh_token;
			if (!refreshToken) {
				throw new UnauthorizedError("Refresh token not found");
			}

			let payload: any;
			try {
				payload = jwt.verify(refreshToken, config.get("JWT_REFRESH_SECRET") as string);
			} catch (err) {
				throw new UnauthorizedError("Invalid or expired refresh token");
			}

			if (!payload?.userId) {
				throw new UnauthorizedError("Invalid refresh token payload");
			}

			const user = await this.userService.getUserById(payload.userId);
			if (!user) {
				throw new NotFoundError("User not found");
			}

			const tokens = this.generateTokens(user);
			this.setCookie(res, tokens);

			logger.info("User refreshed successfully", { id: user.id });

			return res.status(200).json({
				data: { accessToken: tokens.accessToken },
				message: "Token refreshed successfully",
			});
		} catch (error) {
			next(error);
		}
	}

	private generateTokens(user: typeof userTable.$inferSelect) {
		const payload = {
			userId: user.id,
		};
		const accessToken = jwtService.getUserJwtToken(user);

		const refreshToken = jwt.sign(payload, config.get("JWT_REFRESH_SECRET") as string, {
			expiresIn: config.get("JWT_REFRESH_EXPIRES_IN") as any,
		});

		return { accessToken, refreshToken };
	}

	private setCookie(
		res: express.Response,
		tokens: { accessToken: string; refreshToken: string }
	) {
		const expires = new Date(Date.now() + 36_00_000 * 24 * 30);
		const isProd = config.get("NODE_ENV") === "production";
		res.cookie("refresh_token", tokens.refreshToken, {
			httpOnly: true,
			secure: isProd,
			sameSite: isProd ? "none" : "lax",
			expires,
		}).cookie("access_token", tokens.accessToken, {
			httpOnly: true,
			secure: config.get("NODE_ENV") === "production",
			sameSite: isProd ? "none" : "strict",
			maxAge: 15 * 60_000,
		});
	}
}

export const authController = new AuthController();

export default AuthController;
