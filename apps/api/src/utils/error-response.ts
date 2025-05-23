// Custom errors
export class ApiError extends Error {
	status: number;
	name: string;
	stack?: string | undefined;

	constructor(status: number, message: string, stack?: string) {
		super(message);
		this.status = status;
		this.name = this.constructor.name;
		this.stack = stack;
	}
}

// Bad Request
export class BadRequestError extends ApiError {
	constructor(message: string, stack?: string) {
		super(400, message, stack);
	}
}

// Zod Validation Error
export class ZodValidationError extends ApiError {
	constructor(message: string, stack?: string) {
		super(400, message, stack);
	}
}

// Unauthorized
export class UnauthorizedError extends ApiError {
	constructor(message: string) {
		super(401, message);
	}
}

// Forbidden
export class ForbiddenError extends ApiError {
	constructor(message: string) {
		super(403, message);
	}
}

// Not Found
export class NotFoundError extends ApiError {
	constructor(message: string) {
		super(404, message);
	}
}

// Conflict
export class ConflictError extends ApiError {
	constructor(message: string) {
		super(409, message);
	}
}

// Limit Exceeded
export class LimitExceededError extends ApiError {
	constructor(message: string) {
		super(429, message);
	}
}

// Internal Server Error
export class InternalServerError extends ApiError {
	constructor(message: string) {
		super(500, message);
	}
}

// Service Unavailable
export class ServiceUnavailableError extends ApiError {
	constructor(message: string) {
		super(503, message);
	}
}
