import dotenv from "dotenv";

class EnvConfig {
    private keys: string[] = ["PORT"];

	constructor() {
        EnvConfig.loadEnv();
        this.checkEnv();
	}

    private checkEnv() {
        this.keys.forEach((key) => {
            if (!process.env[key]) {
                throw new Error(`Environment variable ${key} is not defined`);
            }
        });
    }

	public static loadEnv() {
		dotenv.config();
	}

    public static getEnv() {
        return process.env;
    }

    public static get(key: string) {
        const value = process.env[key];
        if (!value) {
            throw new Error(`Environment variable ${key} is not defined`);
        }
        return value;
    }

    get(key: string) {
        return EnvConfig.get(key);
    }
}

export const config = new EnvConfig();

export default EnvConfig;