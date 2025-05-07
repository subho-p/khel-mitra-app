import app from "app.js";
import "dotenv/config";

const PORT = process.env.PORT;

try {
	app.listen(PORT, () => {
		console.log(`Server check at http://localhost:${PORT}/health`);
	});
} catch (error) {
	console.log(`[ERROR] ${error}`);
	process.exit(1);
}
