const questionRouter = require('express').Router();
const handleQuestionRequest = require('../models/handleQuestionRequest');

questionRouter.get('/dog', async (req, res, next) => {
    const result = {
        success: false,
        data: null,
    };

    try {
        let page = parseInt(req.query.page || 1);
        const itemsPerPage = 5;

        // 페이지 값이 숫자가 아니거나 1 미만일 경우 에러 메시지를 반환
        if (isNaN(page) || page < 1) {
            result.message = 'Page not found';
            return res.status(400).send(result);
        }

        const results = await handleQuestionRequest('dog', page, itemsPerPage);

        if (!results || results.length === 0) {
            result.message = 'Page not found';
            res.status(404).send(result);
        } else {
            result.data = results;
            res.status(200).send(result);
        }
    } catch (error) {
        return next(error);
    }
});

questionRouter.get('/cat', async (req, res, next) => {
    const result = {
        success: false,
        data: null,
    };

    try {
        let page = parseInt(req.query.page || 1);
        const itemsPerPage = 5;

        // 페이지 값이 숫자가 아니거나 1 미만일 경우 에러 메시지를 반환
        if (isNaN(page) || page < 1) {
            result.message = 'Page not found';
            return res.status(400).send(result);
        }

        const results = await handleQuestionRequest('cat', page, itemsPerPage);

        if (!results || results.length === 0) {
            result.message = 'Page not found';
            res.status(404).send(result);
        } else {
            result.data = results;
            res.status(200).send(result);
        }
    } catch (error) {
        return next(error);
    }
});

module.exports = questionRouter;
