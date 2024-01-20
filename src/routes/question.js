const questionRouter = require('express').Router();
const { pgPool } = require('../config/database/postgre');
const { InternalServerError } = require('../module/Exception');
const controller = require('../module/controller');
const { questionGetValidation } = require('../module/validate');

questionRouter.get(
    '/peti/question',
    questionGetValidation,
    controller(async (req, res, next) => {
        const { type } = req.query; //동물 종류 (강아지, 고양이)

        //질문을 찾는 쿼리문
        const queryResult = await pgPool.query(
            `SELECT 
                idx AS "idx",
                question AS "question",
                type AS "type", 
                left_option AS "leftOption",
                right_option AS "rightOption",
                question_type AS "questionType"
            FROM 
                question 
            WHERE 
                type = $1 
            ORDER BY RANDOM()`,
            [type]
        );

        res.status(200).send(queryResult.rows);
    })
);

module.exports = questionRouter;
