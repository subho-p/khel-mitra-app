import dotenv from "dotenv";
import { logger } from "../utils/logger.js";

const REQUIRED_KEYS = ["SOCKET_PORT", "PLAYER_JWT_SECRET", "CORS_ORIGIN"] as const;

class EnvConfig {
	constructor() {
        logger.info("Loading environment variables");
		EnvConfig.loadEnv();
		this.checkEnv();
	}

	static loadEnv() {
		dotenv.config();
	}

	checkEnv() {
		for (const key of REQUIRED_KEYS) {
			if (!process.env[key]) {
                logger.error(`Environment variable ${key} is not defined`);
                throw new Error(`Environment variable ${key} is not defined`);
			}
		}

        logger.info("Environment variables loaded");
	}

	static get(key: typeof REQUIRED_KEYS[number]) {
        return process.env[key]!;
	}
}

export default EnvConfig;

export const config = new EnvConfig();