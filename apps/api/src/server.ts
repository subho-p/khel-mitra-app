import app from "app.js";
import EnvConfig, { config } from "config/env.config.js";

try {
	app.listen(config.get("PORT"), () => {
		console.log(`Server check at http://localhost:${config.get("PORT")}/health`);
	});
} catch (error) {
	console.log(`[ERROR] ${error}`);
	process.exit(1);
}
