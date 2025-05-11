import { logger } from "@khel-mitra/logger";
import app from "./app.js";
import EnvConfig, { config } from "./config/env.config.js";
import { dbHealthCheck } from "./utils/db-health-check.js";

const startServer = async () => {
	try {
		await dbHealthCheck();

		app.listen(config.get("PORT"), () => {
			logger.info(`Server listening on port ${config.get("PORT")}`);
		});
	} catch (error) {
		logger.error(error);
		process.exit(1);
	}
};

startServer();
