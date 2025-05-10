import express from "express";
import * as argon from "argon2";
import jwt from "jsonwebtoken";

import { userTable } from "@khel-mitra/db/schemas";
import { signInSchema, signUpSchema } from "@khel-mitra/shared/schemas";
import { zodValidation } from "@khel-mitra/shared/utils/zod-validation";
import { logger } from "@khel-mitra/shared/utils/logger";

import { config } from "../config/env.config.js";
import { UserService } from "../services/user.service.js";

import passport from "passport";

class AuthController {
	private userService = new UserService();
	constructor() {
		logger.info("AuthController initialized");

		this.signUp = this.signUp.bind(this);
		this.signIn = this.signIn.bind(this);
		this.signOut = this.signOut.bind(this);
		this.refresh = this.refresh.bind(this);
	}

	public async signUp(req: express.Request, res: express.Response) {
		try {
			const { email, password } = zodValidation(signUpSchema, req.body);

			const existsUser = await this.userService.isUserAlreadyExists(email);
			if (existsUser) {
				return res.status(409).json({ message: "User already exists" });
			}

			const newUser = await this.userService.createUser(email);
			if (!newUser) {
				return res.status(500).json({ message: "Failed to create user" });
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
		} catch (error) {
			logger.error("Sign-up failed", { error });
			return res.status(500).json({ message: "Internal server error" });
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
						return res
							.status(400)
							.json({ message: info?.message || "Invalid credentials" });
					}

					req.logIn(user, { session: false }, async (loginErr) => {
						if (loginErr) {
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
						return res.status(500).json({ message: "Error during logout" });
					}
				});
			}

			// Clear JWT cookies
			res.clearCookie("access_token", { httpOnly: true, secure: true, sameSite: "strict" });
			res.clearCookie("refresh_token", { httpOnly: true, secure: true, sameSite: "strict" });

			return res.status(200).json({ message: "User signed out successfully" });
		} catch (error) {
			return res.status(500).json({ message: "Logout failed", error });
		}
	}

	public async refresh(req: express.Request, res: express.Response) {
		try {
			const refreshToken = req.cookies.refresh_token;
			if (!refreshToken) {
				return res.status(401).json({ message: "Refresh token not found" });
			}

			let payload: any;
			try {
				payload = jwt.verify(refreshToken, config.get("JWT_REFRESH_SECRET") as string);
			} catch (err) {
				return res.status(401).json({ message: "Invalid or expired refresh token" });
			}

			if (!payload?.userId) {
				return res.status(401).json({ message: "Invalid refresh token payload" });
			}

			const user = await this.userService.getUserById(payload.userId);
			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			const tokens = this.generateTokens(user);
			this.setCookie(res, tokens);

			logger.info("User refreshed successfully", { id: user.id });

			return res.status(200).json({
				data: { accessToken: tokens.accessToken },
				message: "Token refreshed successfully",
			});
		} catch (error) {
			logger.error("Token refresh failed", { error });
			return res.status(500).json({ message: "Internal server error" });
		}
	}

	private generateTokens(user: typeof userTable.$inferSelect) {
		const payload = {
			userId: user.id,
		};
		const accessToken = jwt.sign(payload, config.get("JWT_SECRET"), {
			expiresIn: config.get("JWT_EXPIRES_IN") as any,
		});

		const refreshToken = jwt.sign(payload, config.get("JWT_REFRESH_SECRET") as string, {
			expiresIn: config.get("JWT_REFRESH_EXPIRES_IN") as any,
		});

		return { accessToken, refreshToken };
	}

	private setCookie(
		res: express.Response,
		tokens: { accessToken: string; refreshToken: string }
	) {
		res.cookie("refresh_token", tokens.refreshToken, {
			httpOnly: true,
			secure: config.get("NODE_ENV") === "production",
			sameSite: "strict",
			maxAge: 15 * 60_000,
		}).cookie("access_token", tokens.accessToken, {
			httpOnly: true,
			secure: config.get("NODE_ENV") === "production",
			sameSite: "strict",
			maxAge: 36_00_000 * 24 * 7,
		});
	}
}

export const authController = new AuthController();

export default AuthController;
