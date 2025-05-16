import { Server, Socket } from "socket.io";
import { SocketLogger } from "../utils/logger.js";
import { UserStore } from "../stores/user.store.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { TestHandler } from "../handlers/test.handler.js";
import { TicTacToeHandler } from "handlers/tic-tac-toe.handler.js";

class SocketService {
	private readonly logger = new SocketLogger();
	constructor(private readonly io: Server) {
		this.init();
	}

	public init() {
		this.logger.info("Socket service initialized");

		this.io.use(authMiddleware);
		this.io.on("connection", this.onConnection.bind(this));
	}

	private onConnection(socket: Socket) {
		this.logger.info(`[CONNECT] Socket ${socket.id} connected`);

		this.routesHandler(socket);

		socket.on("disconnect", () => {
			UserStore.getInstance().remove(socket.id);
			this.logger.info(`[DISCONNECT] Socket ${socket.id} disconnected`);
		});
	}

	private routesHandler(socket: Socket) {
		// Test
		const testHandler = new TestHandler(socket, this.io);
		testHandler.registeredEvents();

		// Tic Tac Toe
		const ticTacToeHandler = new TicTacToeHandler(socket, this.io);
		ticTacToeHandler.registeredEvents();
	}
}

export default SocketService;
