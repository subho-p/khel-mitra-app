export interface SocketResponse<T = any> {
	status: "success" | "error";
	data?: T;
	message?: string;
	name?: string;
}
