import { EventHandler } from "./handler.js";
import * as store from "../stores/index.js";

export class AdminHandler extends EventHandler {
	protected nameSpace: string = "admin";
	protected subNameSpace: string = "status";
	protected events: string[] = ["get-all"];

	getAll() {
		const users = store.UserStore.getInstance().getAll();

		const userWithStatus = users.map((user) => {
			return {
				...user,
				status: store.UserStore.getInstance().getstatusByuserId(user.id),
			};
		});

		const rooms = store.GamesStore.getInstance().getAllRoomsStatus();

		this.success({ users: userWithStatus, rooms });
	}
}
