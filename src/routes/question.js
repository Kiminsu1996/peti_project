const questionRouter = require('express').Router();
const { postgre, pgPool } = require('../config/database/postgre');
const { BadRequestException } = require('../module/Exception');
const controller = require('../module/controller');

questionRouter.get(
    '/peti/question',
    controller(async (req, res, next) => {
        const { type } = req.query; //동물 종류 (강아지, 고양이)

        if (!['dog', 'cat'].includes(type)) {
            throw new BadRequestException('Wrong information');
        }

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
