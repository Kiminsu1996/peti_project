const questionRouter = require('express').Router();
const { postgre } = require('../config/database/postgre');
const { BadRequestException, HttpException } = require('../module/Exception');

questionRouter.get('/:type', async (req, res, next) => {
    const type = req.params.type; //동물 종류 (강아지, 고양이)
    let conn = null;

    try {
        conn = await postgre.connect();

        if (Object.keys(req.query).length !== 0 || !['dog', 'cat'].includes(type)) {
            return next(new BadRequestException('Wrong information'));
        }

        //질문을 찾는 쿼리문
        const idxRange = type === 'dog' ? [1, 20] : [21, 40];
        const queryResult = await postgre.query(
            `SELECT 
                idx AS "idx",
                question AS "question",
                type AS "type", 
                left_option AS "leftOption",
                right_option AS "rightOption",
                question_type AS "questionType",
                weight AS "wegight"
            FROM 
                question 
            WHERE 
                type = $1 
            AND 
                idx 
            BETWEEN 
                $2 
            AND 
                $3 
            ORDER BY RANDOM()`,
            [type, ...idxRange]
        );

        if (!queryResult.rows || queryResult.rows.length === 0) {
            return next(new HttpException(404, 'Questions Not Found'));
        }

        res.status(200).send({
            success: true,
            totalQuestions: queryResult.rows.length,
            data: queryResult.rows,
        });
    } catch (error) {
        return next(error);
    } finally {
        if (conn) {
            conn.end();
        }
    }
});

module.exports = questionRouter;
