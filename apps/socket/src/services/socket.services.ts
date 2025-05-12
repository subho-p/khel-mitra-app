import { Server, Socket } from "socket.io";
import { SocketLogger } from "../utils/logger.js";
import { Failure, Success } from "../utils/reponse.js";
import { BaseUser } from "../types/index.js";
import jwt from "jsonwebtoken";

class SocketService {
	private readonly logger = new SocketLogger();
	constructor(private readonly io: Server) {
        this.init();
    }

	public init() {
		this.logger.info("Socket service initialized");

		this.io.use(this.attachUserContext.bind(this));
		this.io.on("connection", this.onConnection.bind(this));
	}

	private async attachUserContext(socket: Socket, next: (err?: any) => void): Promise<void> {
		const token = socket.handshake.auth?.playerToken;
		// if (!token) return next(new Failure("Unauthorized"));

		const user = this.extractTokenData(token);
		// if (!user) return next(new Failure("Unauthorized"));

		socket.data.user = {
			...user,
			socketId: socket.id,
		};

		next();
	}

	private onConnection(socket: Socket) {
		this.logger.info(`[CONNECT] Socket ${socket.id} connected`);

		socket.use(async (packet, next) => {
			this.logger.info(`[PACKET] ${JSON.stringify(packet)}`);
			next();
		});

        socket.on("ping", (_, callback) => {
            callback(new Success("pong"));
        })

		socket.on("disconnect", () => {
			this.logger.info(`[DISCONNECT] Socket ${socket.id} disconnected`);
		});
	}

	private extractTokenData(token: string): BaseUser | undefined {
		try {
			const payload = jwt.verify(token, process.env.PLAYER_JWT_SECRET as string);
			if (!payload) return undefined;
			return payload as BaseUser;
		} catch {
			return undefined;
		}
	}
}

export default SocketService;
