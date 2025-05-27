import { EventHandler } from "./handler.js";
import { Success } from "../utils/reponse.js";

export class ChatHandler extends EventHandler {
	protected readonly nameSpace = "chat";
	protected readonly events = ["message"];

	message(data: { roomId: string; message: string }) {
		const { roomId, message } = data;
		if (!roomId || !message) {
			this.failure("Room ID and message are required.");
			return;
		}
        console.log("Chat message received:", data);

		this.broadcast(
			this.toEventName("message"),
			roomId,
			new Success(
				{
					roomId,
					message,
					user: this.socket.data.user,
				},
				"Message sent successfully."
			)
		);
	}
}
