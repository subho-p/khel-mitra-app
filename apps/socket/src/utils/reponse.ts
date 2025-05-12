export interface SocketResponse<T = any> {
	status: "success" | "error";
	data?: T;
	message?: string;
    name?: string
}

export class Success<T = any> implements SocketResponse<T> {
	readonly status = "success";
	constructor(
		public data?: T,
		public message?: string
	) {}
}

export class Failure implements SocketResponse<never> {
	readonly status = "error";
	public name?: string;
	constructor(public message?: string, name?: string) {
		if (!message) {
			this.message = "Something went wrong";
		}
		if (!name) {
			this.name = "Error";
		}
	}
}

export class Unauthorized implements SocketResponse<never> {
	readonly status = "error";
    readonly name = "Unauthorized";
	constructor(public message?: string) {
		if (!message) {
			this.message = "Unauthorized";
		}
	}
}

export function success<T = any>(data?: T, message?: string) {
	return new Success(data, message);
}

export function failure(message?: string) {
	return new Failure(message);
}
