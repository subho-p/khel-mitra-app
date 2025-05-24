import { logger } from "../utils/logger.js";
import { EventHandler } from "./handler.js";

export class TestHandler extends EventHandler {
	protected nameSpace: string = "tests";
	protected events: string[] = ["test"];

	test(data: any): void {
		const user = this.socket.data.user;

		logger.info(`User ${user.socketId} test`);

		if (!user) {
			this.failure("Unauthorized user");
			return;
		}
		this.success({ user });
	}
}
