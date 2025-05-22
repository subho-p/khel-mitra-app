import { socket as baseSocket } from "./socket.manager";

export const socketEmitter = <T>(event: string, data: object): Promise<T | null> => {
    return baseSocket.emitWithAck(event, data);
};
