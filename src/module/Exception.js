class HttpException {
    message;
    status;
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

module.exports = { HttpException, BadRequestException, NotFoundException };
