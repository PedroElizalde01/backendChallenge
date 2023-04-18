export class ApiError extends Error {
    public statusCode!: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class BadRequestError extends ApiError {
    constructor(message: string) {
        super(message, 400);
    }
}

export class UnauthenticatedError extends ApiError {
    constructor(message: string) {
        super(message, 401);
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message: string) {
        super(message, 403);
    }
}

export class NotFoundError extends ApiError {
    constructor(message: string) {
        super(message, 404);
    }
}

export class MethodNotAllowedError extends ApiError {
    constructor(message: string) {
        super(message, 405);
    }
}

export class InternalServerError extends ApiError {
    constructor() {
        super('Internal server error', 500);
    }
}