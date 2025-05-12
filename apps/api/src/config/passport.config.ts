import LocalStrategy from "passport-local";
import JwtStrategy, { ExtractJwt } from "passport-jwt";
import passport from "passport";
import argon from "argon2";
import express from "express";
import { logger } from "@khel-mitra/logger";
import { UserService } from "../services/user.service";

class PassportConfig {
	private userService: UserService;
	constructor() {
		logger.info("Passport Config initialized");
		this.userService = new UserService();
		this.initializePassport();
	}

	initializePassport() {
		passport.use(this.jwtStrategy());
		passport.use(this.localStrategy());

        passport.serializeUser((user: any, done) => {
            done(null, user.id);
        });

        passport.deserializeUser(async (id: string, done) => {
            const user = await this.userService.getUserById(id);
            done(null, user);
        });
	}

	private localStrategy() {
		return new LocalStrategy.Strategy(
			{
				usernameField: "emailOrUsername",
				passwordField: "password",
			},
			async (emailOrUsername, password, done) => {
				try {
					const user = await this.userService.getUserByEmailOrUsername(emailOrUsername);
					if (!user) {
						return done(null, false, { message: "User not found" });
					}
					const userPassword = await this.userService.getUserPassword(user.id);
					if (!userPassword) {
						return done(null, false, { message: "User password not found" });
					}

					const isPasswordValid = await argon.verify(userPassword.password, password);
					if (!isPasswordValid) {
						return done(null, false, { message: "Invalid password" });
					}

					return done(null, user);
				} catch (error) {
					return done(error, false);
				}
			}
		);
	}

	private jwtStrategy() {
		return new JwtStrategy.Strategy(
			{
				jwtFromRequest: ExtractJwt.fromExtractors([
					ExtractJwt.fromAuthHeaderAsBearerToken(),
					this.getAccessTokenFromCookie,
				]),
				secretOrKey: process.env.JWT_SECRET!,
			},
			async (jwtPayload, done) => {
				try {
					const user = await this.userService.getUserById(jwtPayload.userId);
					if (!user) {
						return done(null, false, { message: "User not found" });
					}
					return done(null, user);
				} catch (error) {
					return done(error, false);
				}
			}
		);
	}

	private getAccessTokenFromCookie(req: express.Request): string | null {
		let token = null;
		if (req && req.cookies) token = req.cookies["access_token"];
		return token;
	}
}

export default new PassportConfig();