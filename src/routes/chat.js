const chatRouter = require('express').Router();
const { pgPool } = require('../config/database/postgre');
<<<<<<< HEAD
const controller = require('../controller/controller');
const { chatPostValidation, chatGetValidation } = require('../middleware/validate');
const { logging } = require('../module/logging');
=======
const controller = require('../module/controller');
const { chatGetValidation } = require('../middleware/validate');
>>>>>>> test

chatRouter.get(
    '/messages/:petiType',
    chatGetValidation,
    controller(async (req, res, next) => {
        const { lastIdx } = req.query;
        const { petiType } = req.params;
        const limit = 50;

<<<<<<< HEAD
        if (lastIdx) {
            query = `
                SELECT
                    idx,
                    peti_eng_name AS "petiType",
                    message
                FROM 
                    chat 
                WHERE 
                    peti_eng_name = $1 AND idx < $2 
                ORDER BY 
                    idx ASC 
                LIMIT 
                    $3`;
            messages = await pgPool.query(query, [petiType, lastIdx, limit]);
        } else {
            query = `
                SELECT 
                    peti_eng_name AS "petiType",
                    message
                FROM 
                    chat 
                WHERE 
                    peti_eng_name = $1
                ORDER BY 
                    idx ASC 
                LIMIT 
                    $2`;
            messages = await pgPool.query(query, [petiType, limit]);
        }
        await logging(req, res, next);
=======
        let whereCondition = lastIdx ? `AND idx < $2` : '';
        let query = `
            SELECT
                idx,
                peti_eng_name AS "petiType",
                message
            FROM 
                chat 
            WHERE 
                peti_eng_name = $1
                ${whereCondition}
            ORDER BY 
                idx ASC 
            LIMIT 
                ${lastIdx ? '$3' : '$2'}
        `;

        let queryParams = lastIdx ? [petiType, lastIdx, limit] : [petiType, limit];

        const messages = await pgPool.query(query, queryParams);
>>>>>>> test
        res.status(200).json(messages.rows);
    })
);
module.exports = chatRouter;
