class ApiError extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }

    static BadRequest(message) {
        return new ApiError(400, message);
    }

    static Internal(message) {
        return new ApiError(500, message);
    }

    static NotFound(message) {
        return new ApiError(404, message);
    }
}

module.exports = ApiError;
