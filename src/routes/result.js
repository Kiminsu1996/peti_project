const resultRouter = require('express').Router();
const { postgre } = require('../config/database/postgre');
const calculateWeightPercentage = require('../models/weightPercentage');
const typeElement = require('../models/typeElementCalculate');

resultRouter.post('/', async (req, res, next) => {
    const { arrayResponses, id } = req.body;
    const results = [];
    let petiType = '';
    let aProportion, eProportion, cProportion, lProportion;
    let percentage, typeElementResult;
    let conn = null;

    try {
        conn = await postgre.connect();

        if (id) {
            for (let i = 0; i < arrayResponses.length; i++) {
                const responses = arrayResponses[i];
                const questionType = responses[0].question_type;
                const weightPercentage = calculateWeightPercentage(responses, questionType);
                weightPercentage.typeElementResult = typeElement(weightPercentage.percentage, questionType);
                results.push({ weightPercentage });

                ({ percentage, typeElementResult } = weightPercentage);
                petiType += typeElementResult;

                if (questionType === '활동성') aProportion = percentage;
                if (questionType === '식탐성') eProportion = percentage;
                if (questionType === '사교성') cProportion = percentage;
                if (questionType === '애교성') lProportion = percentage;
            }
            // SQL 쿼리 작성
            // const sql = `
            //     UPDATE peti_result
            //     SET peti_type = $1, a_proportion = $2, e_proportion = $3, c_proportion = $4, l_proportion = $5
            //     WHERE id = $6;
            // `;
            // await postgre.query(sql, [petiType, aProportion, eProportion, cProportion, lProportion, id]);
        }
        res.status(200).send(results);
    } catch (error) {
        return next(error);
    } finally {
        if (conn) {
            conn.end();
        }
    }
});

module.exports = resultRouter;
