import { socket as baseSocket } from "@/socket/socket.manager";
import type { SocketResponse } from "@/types";

class TicTacToeSocketManager {
    private static instance: TicTacToeSocketManager;
    _socket = baseSocket;

    private registeredEvents: string[] = [];

    private constructor() {}

    static getInstance() {
        if (!TicTacToeSocketManager.instance) {
            TicTacToeSocketManager.instance = new TicTacToeSocketManager();
        }
        return TicTacToeSocketManager.instance;
    }

    // Create a new private room
    async createPrivateRoom(callback?: (res: SocketResponse) => void) {
        return await this._socket.emit(this._event("create"), {}, callback);
    }

    // onOpponent joined
    onOpponentJoined(callback: (res: SocketResponse) => void) {
        this.registeredEvents.push(this._event("opponent-joined"));
        return this._socket.on(this._event("opponent-joined"), callback);
    }

    // Player leaves the room
    leaveRoom(roomId: string, playerId: string, callback?: (res: SocketResponse) => void) {
        return this._socket.emit(this._event("leave"), { roomId, playerId }, callback);
    }

    // join a room
    joinRoom(roomCode: string, callback?: (res: SocketResponse) => void) {
        return this._socket.emit(this._event("join"), { roomCode }, callback);
    }

    // randomly join a room
    joinRandomRoom(callback?: (res: SocketResponse) => void) {
        return this._socket.emit(this._event("random"), {}, callback);
    }

    // start the game
    startGame(roomId: string, callback?: (res: SocketResponse) => void) {
        return this._socket.emit(this._event("start"), { roomId }, callback);
    }

    // on game started
    onGameStarted(callback: (res: SocketResponse) => void) {
        this.registeredEvents.push(this._event("start"));
        return this._socket.on(this._event("start"), callback);
    }

    // make a move
    move(cell: number, roomId: string) {
        return this._socket.emit(this._event("move"), { cell, roomId });
    }

    // on move made
    onMoveMade(callback: (res: SocketResponse) => void) {
        this.registeredEvents.push(this._event("move"));
        return this._socket.on(this._event("move"), callback);
    }

    // player left
    playerLeft(callback?: (res: SocketResponse) => void) {
        return this._socket.emit(this._event("player-left"), {}, callback);
    }

    // player left the game any time or socket disconnected
    onPlayerLeft(callback: (res: any) => void) {
        this.registeredEvents.push(this._event("player-left"));
        this._socket.on(this._event("player-left"), callback);
        this._socket.on("disconnect", callback);
    }

    // on game ended
    onGameEnded(callback: (res: SocketResponse) => void) {
        this.registeredEvents.push(this._event("end"));
        return this._socket.on(this._event("end"), callback);
    }

    // off all events
    offAllEvents() {
        this.registeredEvents.forEach((event) => {
            this._socket.socket?.off(event);
        });
        this.registeredEvents = [];
    }

    private _event(event: string) {
        return `games:tic-tac-toe:${event}`;
    }
}

export const ticTacToeSocketManager = TicTacToeSocketManager.getInstance();
