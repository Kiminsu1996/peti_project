const { InternalServerError } = require('../exception/exception');
const controller = (requestHandler) => {
    return async (req, res, next) => {
        try {
            await requestHandler(req, res, next);
        } catch (error) {
            console.log(error);
            next(new InternalServerError('Internal Server Error'));
        }
    };
};

module.exports = controller;
