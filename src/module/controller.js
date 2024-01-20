const { InternalServerError } = require('../module/Exception');
const controller = (requestHandler) => {
    return async (req, res, next) => {
        try {
            await requestHandler(req, res, next);
        } catch (error) {
            next(new InternalServerError('Internal Server Error'));
        }
    };
};

module.exports = controller;
