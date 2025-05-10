export class ApiResponse<T> {
	status: number = 200;
	data: T;
	message?: string;

	constructor(status: number, data: T, message?: string) {
		this.status = status;
		this.data = data;
		this.message = message;
	}
}

export class ApiSuccessResponse<T> extends ApiResponse<T> {
	constructor(data: T, message?: string) {
		super(200, data, message);
	}
}

export class ApiCreateResponse<T> extends ApiResponse<T> {
	constructor(data: T, message?: string) {
		super(201, data, message);
	}
}

export class ApiEmptyResponse extends ApiResponse<null> {
	constructor(message?: string) {
		super(200, null, message);
	}
}
