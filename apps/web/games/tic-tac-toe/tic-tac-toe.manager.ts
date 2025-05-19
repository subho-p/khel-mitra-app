import { socketManager } from "@/socket/socket.manger";
import { TicTacToeRoom } from "./types";
import { delay } from "@/lib/utils";

export class TicTacToeManager {
	static instance: TicTacToeManager;
	static getInstance() {
		if (!TicTacToeManager.instance) {
			TicTacToeManager.instance = new TicTacToeManager();
		}
		return TicTacToeManager.instance;
	}

	private constructor() {
		this.connect();
	}

	public connect() {
		socketManager.connect();
	}

	// Create room
	public async createRoom() {
		await delay(1000);
		return await socketManager.emitWithAck<{ room: TicTacToeRoom }>(
			this.setEventname("create"),
			{}
		);
	}

	// listen on opponent-joined
	public onOpponentJoined(callback: (...args: any[]) => void) {
		socketManager.registerEvent(this.setEventname("opponent-joined"), callback);
	}

	// Join room
	public async joinRoom(roomCode: string) {
		await delay(1000);
		return await socketManager.emitWithAck<{
			room: TicTacToeRoom;
		}>(this.setEventname("join"), {
			roomCode,
		});
	}

	// Leave room
	public async leaveRoom(roomId: string, playerId: string) {
		socketManager
			.emitWithAck<{ room: TicTacToeRoom }>(this.setEventname("leave"), {
				roomId,
				playerId,
			})
			.then((res) => {
				socketManager.socket?.on(this.setEventname("player-left"), (res) => {
					console.log(res);
					return res;
				});
			})
			.catch((err) => console.log(err));
	}

	public async onPlayerLeft(callback: (...arg: any[]) => void) {
		socketManager.socket?.on(this.setEventname("player-left"), callback);
	}

	// Start game
	public async startGame(roomId: string) {
		await delay(1000);
		return await socketManager.emitWithAck<{ room: TicTacToeRoom }>(
			this.setEventname("start"),
			{
				roomId,
			}
		);
	}

	// notify the opponent to start the game
	public async ready(roomId: string) {
		return await socketManager.emitWithAck<{ room: TicTacToeRoom }>(
			this.setEventname("ready"),
			{
				roomId,
			}
		);
	}

	// listen on game-started
	public onGameStarted(callback: (...args: any[]) => void) {
		socketManager.registerEvent(this.setEventname("start"), callback);
	}

    // make move
    public async makeMove(roomId: string, cell: number) {
        return await socketManager.emitWithAck<{ room: TicTacToeRoom }>(
            this.setEventname("move"),
            {
                roomId,
                cell,
            }
        );
    }

    // on move 
    public onMove(callback: (...args: any[]) => void) {
        socketManager.registerEvent(this.setEventname("move"), callback);
    }

	public disconnect() {
		socketManager.disconnect();
	}

	public emit(event: string, data?: any, callback?: (...args: any[]) => void) {
		socketManager.emit(this.setEventname(event), data, callback);
	}

	public on(event: string, handler: (...args: any[]) => void) {
		socketManager.registerEvent(this.setEventname(event), handler);
	}

	private setEventname(event: string): string {
		return `games:tic-tac-toe:${event}`;
	}
}

export const ticTacToeManager = TicTacToeManager.getInstance();
