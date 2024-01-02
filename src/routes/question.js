const questionRouter = require('express').Router();
const questionModel = require('../models/selectQuestion');

questionRouter.get('/dog', async (req, res, next) => {
    const result = {
        success: false,
        data: null,
    };

    try {
        const page = parseInt(req.query.page || 1);
        const itemsPerPage = 5;
        const questions = await questionModel.getQuestions('dog', page, itemsPerPage);

        if (questions.length > 0) {
            result.success = true;
            result.data = questions;
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
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
        const page = parseInt(req.query.page || 1);
        const itemsPerPage = 5;
        const questions = await questionModel.getQuestions('cat', page, itemsPerPage);

        if (questions.length > 0) {
            result.success = true;
            result.data = questions;
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    } catch (error) {
        return next(error);
    }
});

module.exports = questionRouter;
