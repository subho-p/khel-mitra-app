import type { SocketResponse } from "@/types/socket.type";

// type guards
export function isSuccess<T>(res: SocketResponse<T>): res is { status: "success"; data: T } {
	return res.status === "success";
}

export function isFailure<T>(res: SocketResponse<T>): res is { status: "error"; message?: string } {
	return res.status === "error";
}

// unwrap socket response
export function unwrapSocketResponse<T>(res: SocketResponse<T>): T | undefined {
	if (isSuccess(res)) return res.data;

	throw new Error(res.message ?? "Something went wrong");
}

// try/catch for socket response
export function handleSocketResponse<T>(
	res: SocketResponse<T>,
	handlers: {
		onSuccess?: (data: T) => void;
		onError?: (message: string) => void;
	}
) {
	if (isSuccess(res)) handlers.onSuccess?.(res.data);
	if (isFailure(res)) handlers.onError?.(res.message ?? "Something went wrong");

	return res.data;
}