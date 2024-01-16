const chatRouter = require('express').Router();
const { postgre } = require('../config/database/postgre');
const { chatPostValidation, chatGetValidation } = require('../module/validate');

// 채팅방 메세지 저장 API
chatRouter.post('/chat', chatPostValidation, async (req, res, next) => {
    const { uuid, petiType, message } = req.body;

    try {
        const result = await postgre.query(
            `INSERT INTO
                chat
                    (result_uuid, peti_eng_name, message)
                VALUES
                    ($1, $2, $3) RETURNING idx`,
            [uuid, petiType, message]
        );

        const idx = result.rows[0].idx;

        res.status(200).send({ lastIdx: idx });
    } catch (error) {
        return next(error);
    }
});

// 채팅방 메시지 조회 API
chatRouter.get('/chat/messages', chatGetValidation, async (req, res, next) => {
    const { lastIdx, petiType } = req.query;
    const limit = 50;
    try {
        const query = `
            SELECT 
                idx,
                result_uuid AS "uuid",
                peti_eng_name AS "petiType",
                message,
                created
            FROM 
                chat 
            WHERE 
                peti_eng_name = $1 AND idx <= $2 
            ORDER BY 
                idx ASC 
            LIMIT 
                $3`;
        const messages = await postgre.query(query, [petiType, lastIdx, limit]);

        res.status(200).json(messages.rows);
    } catch (error) {
        return next(error);
    }
});

module.exports = chatRouter;
