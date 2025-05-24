import { logger } from "@khel-mitra/logger";

export class SocketLogger {
	info(message: string, context?: string) {
		logger.info(this.modifyMessage(message, context));
	}
	warn(message: string, context?: string) {
		logger.warn(this.modifyMessage(message, context));
	}
	debug(message: string, context?: string) {
		logger.debug(this.modifyMessage(message, context));
	}
	error(message: string, context?: string) {
		logger.error(this.modifyMessage(message, context));
	}

	private modifyMessage(message: string, context?: string) {
		let msg: string;
		if (context) msg = `[${context}] ${message}`;
		else msg = message;
		return msg;
	}
}

const socketLogger = new SocketLogger();
export { socketLogger as logger };
