import { createServer } from "./server";
import { logger } from "./utils/logger.js";

const server = createServer();
server.listen(process.env.SOCKET_PORT, () =>
	logger.info(`Socket server listening on port ${process.env.SOCKET_PORT}`)
);
