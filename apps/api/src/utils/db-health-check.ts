import db from "@khel-mitra/db";
import { sql } from "@khel-mitra/db/drizzle";
import { logger } from "@khel-mitra/logger";

export const dbHealthCheck = async () => {
	try {
		await db.execute(sql`SELECT 1`);
		logger.info("✅ Database is healthy");
	} catch (error) {
		logger.error(`Database is unhealthy: ${error}`);
		process.exit(1);
	}
};
