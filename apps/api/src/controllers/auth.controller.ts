import express from "express";
import * as argon from "argon2";
import jwt from "jsonwebtoken";

import { userTable } from "@khel-mitra/db/schemas";
import { signInSchema, signUpSchema } from "@khel-mitra/shared/schemas";
import { logger, zodValidation } from "@khel-mitra/shared/utils";

import { config } from "../config/env.config.js";
import { UserService } from "../services/user.service.js";

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
			if (existsUser) throw new Error("User already exists");

			const newUser = await this.userService.createUser(email);
			if (!newUser) throw new Error("User not created");

			const hashedPassword = await argon.hash(password);
			await this.userService.insertUserCredentials(newUser.id, hashedPassword);

			const tokens = this.generateTokens(newUser);
			this.setCookie(res, tokens);
			res.status(200).json({
				data: { accessToken: tokens.accessToken },
				message: "User signed up successfully",
			});

			logger.info("User signed up successfully", { id: newUser.id });
		} catch (error) {
			throw error;
		}
	}

	public async signIn(req: express.Request, res: express.Response) {
		try {
			const { emailOrUsername, password } = zodValidation(signInSchema, req.body);
			const user = await this.userService.getUserByEmailOrUsername(emailOrUsername);
			if (!user) throw new Error("User not found");

			const userPassword = await this.userService.getUserPassword(user.id);
			if (!userPassword) throw new Error("User password not found");

            const isPasswordValid = await argon.verify(userPassword.password, password);
            if (!isPasswordValid) throw new Error("Invalid password");

			const tokens = this.generateTokens(user);
			this.setCookie(res, tokens);
			res.status(200).json({
				data: { accessToken: tokens.accessToken },
				message: "User signed in successfully",
			});

			logger.info("User signed in successfully", { id: user.id });
		} catch (error) {
			throw error;
		}
	}

    public async signOut(req: express.Request, res: express.Response) {
        try {
            res.clearCookie("access_token");
            res.clearCookie("refresh_token");
            res.status(200).json({ message: "User signed out successfully" });
        } catch (error) {
            throw error;
        }
    }

    public async refresh(req: express.Request, res: express.Response) {
        try {
            const refreshToken = req.cookies.refresh_token;
            if (!refreshToken) throw new Error("Refresh token not found");

            const payload: any = jwt.verify(refreshToken, config.get("JWT_REFRESH_SECRET") as string);
            if (!payload || !payload.userId) throw new Error("Invalid refresh token");

            const user = await this.userService.getUserById(payload.userId);
            if (!user) throw new Error("User not found");

            const tokens = this.generateTokens(user);
            this.setCookie(res, tokens);
            res.status(200).json({
                data: { accessToken: tokens.accessToken },
                message: "User refreshed successfully",
            });

            logger.info("User refreshed successfully", { id: user.id });
        } catch (error) {
            throw error;
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
