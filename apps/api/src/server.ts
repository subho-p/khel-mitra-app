import { logger } from "@khel-mitra/logger";
import app from "./app.js";
import EnvConfig, { config } from "./config/env.config.js";

try {
	app.listen(config.get("PORT"), () => {
		logger.info(`Server check at http://localhost:${config.get("PORT")}/health`);
	});
} catch (error) {
	logger.error(`Server failed to start ${error}`);
	process.exit(1);
}
