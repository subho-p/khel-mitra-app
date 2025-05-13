import { logger } from "@khel-mitra/logger";
import { JWTPayloadOfPlayer, User } from "../types/user.types.js";
import jwt from "jsonwebtoken";
import EnvConfig from "../config/env.config.js";

class JwtService {
	constructor() {
		logger.info("JWT service initialized");
	}

	getPlayerJwtToken(user: User | JWTPayloadOfPlayer) {
		try {
			const payload: JWTPayloadOfPlayer = {
				id: user.id,
				name: user.name,
				username: user.username,
				coins: user.coins,
				image: user.image,
			};

			// FIXME : age
			const token = jwt.sign(payload, EnvConfig.get("PLAYER_JWT_SECRET"), {
				expiresIn: "30m",
			});

			return token;
		} catch (error) {
			throw error;
		}
	}

	verifyPlayerJwt(token: string) {
		try {
			const decoded = jwt.verify(
				token,
				EnvConfig.get("PLAYER_JWT_SECRET")
			) as JWTPayloadOfPlayer;

			return decoded;
		} catch (error) {
			throw error;
		}
	}
}

export const jwtService = new JwtService();

export { JwtService };
