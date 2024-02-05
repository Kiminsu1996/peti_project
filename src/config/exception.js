class HttpException {
    status;
    message;
    err;

    constructor(status, message, err = null) {
        this.status = status;
        this.message = message;
        this.err = err;
    }
}

class BadRequestException extends HttpException {
    constructor(message) {
        super(400, message, null);
    }
}

class NotFoundException extends HttpException {
    constructor(message) {
        super(404, message, null);
    }
}

class InternalServerError extends HttpException {
    constructor(message) {
        super(500, message, null);
    }
}

module.exports = { HttpException, BadRequestException, NotFoundException, InternalServerError };

// 200, 400, 404, 500
