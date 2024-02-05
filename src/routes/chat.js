const chatRouter = require('express').Router();
const { pgPool } = require('../config/database/postgre');
const controller = require('../controller/controller');
const { chatGetValidation } = require('../middleware/validate');
const { logging } = require('../module/logging');
const controller = require('../module/controller');
const { chatGetValidation } = require('../middleware/validate');

chatRouter.get(
    '/messages/:petiType',
    chatGetValidation,
    controller(async (req, res, next) => {
        const { lastIdx } = req.query;
        const { petiType } = req.params;
        const limit = 50;

        let lastIdxCondition = lastIdx ? `AND idx < $2` : '';
        let query = `
        SELECT
            idx,
            peti_eng_name AS "petiType",
            message
        FROM 
            chat 
        WHERE 
            peti_eng_name = $1
            ${lastIdxCondition}
        ORDER BY 
            idx DESC 
        LIMIT 
            ${lastIdx ? '$3' : '$2'}
    `;

        let queryParams = lastIdx ? [petiType, lastIdx, limit] : [petiType, limit];

        const messages = await pgPool.query(query, queryParams);
        res.status(200).json(messages.rows);
    })
);

module.exports = chatRouter;
