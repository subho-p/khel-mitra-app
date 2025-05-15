import { Server, Socket } from "socket.io";
import { Failure, Success } from "../utils/reponse.js";
import { logger } from "utils/logger.js";

export abstract class EventHandler {
	constructor(
		protected readonly socket: Socket,
		protected readonly io: Server
	) {}

	protected abstract readonly nameSpace: string;
	protected readonly subNameSpace: string | null = null;

	protected abstract readonly events: string[];

	private _currentEvent?: string;
	private _currentCallback?: Function;

	public registeredEvents() {
		for (const event of this.events) {
			const eventName = this.toEventName(event);
			const methodName = this.toCamelCase(event);
			const originalhandler = (this as any)[methodName]?.bind(this);

            logger.info(`Registering event (${eventName})`);

			if (!originalhandler) {
                logger.error(`No handler found for event (${eventName})`);
                continue;
            }

			const handler = (data: any, callback?: Function) => {
				this._currentEvent = eventName;
				this._currentCallback = callback;

				try {
					originalhandler(data, callback);
				} catch (error: any) {
					this.failure(error.message || "Something went wrong");
				} finally {
					this._currentEvent = undefined;
					this._currentCallback = undefined;
				}
			};
			this.socket.on(eventName, handler);
		}
	}

	protected emit(event: string, data: any): void {
		this.socket.emit(event, data);
	}

	protected broadcast(event: string, room: string | string[], data: any): void {
		this.io.to(room).emit(event, data);
	}

	protected toEventName(event: string): string {
		if (this.subNameSpace) return `${this.nameSpace}:${this.subNameSpace}:${event}`;
		return `${this.nameSpace}:${event}`;
	}

	protected toCamelCase(event: string): string {
		return event.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
	}

	private res(payload: any) {
		if (!this._currentEvent) {
			throw new Error("No context found for response");
		}
		const event = this._currentEvent;
		const callback = this._currentCallback;

		if (callback) callback(payload);
		else this.emit(event, payload);
	}

	protected failure(error: string): void {
		this.res(new Failure(error));
	}

	protected success(data: any) {
		this.res(new Success(data));
	}
}
