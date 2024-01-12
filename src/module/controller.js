const controller = (requestHandler) => {
    return async (req, res, next) => {
        try {
            await requestHandler(req, res, next);
        } catch (err) {
            return next(err);
        }
    };
};

module.exports = controller;
