import EnvConfig from "./config/env.config.js";
import { createServer } from "./server.js";
import { logger } from "./utils/logger.js";

const PORT = EnvConfig.get("SOCKET_PORT");
const server = createServer();

server.listen(PORT, () => logger.info(`Socket server listening on port ${PORT}`));
