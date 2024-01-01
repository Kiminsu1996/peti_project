const resultRouter = require('express').Router();
const calculateWeightPercentage = require('../models/weightPercentage');

resultRouter.post('/', async (req, res, next) => {
    const arrayResponses = req.body;
    const results = [];

    try {
        for (let i = 0; i < arrayResponses.length; i++) {
            const responses = arrayResponses[i];
            const questionType = responses[0].question_type;
            const weightPercentage = calculateWeightPercentage(responses, questionType);
            results.push({ weightPercentage });
        }
        console.log(results[0].weightPercentage.questionType);
        res.status(200).send(results);
    } catch (error) {
        return next(error);
    } finally {
    }
});

module.exports = resultRouter;
