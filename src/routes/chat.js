const chatRouter = require('express').Router();
const { pgPool } = require('../config/database/postgre');
const controller = require('../controller/controller');
const { chatPostValidation, chatGetValidation } = require('../middleware/validate');
const { logging } = require('../module/logging');

// 채팅방 메세지 저장 / 메세지 저장은 소켓에서 실행
// chatRouter.post(
//     '/chat',
//     chatPostValidation,
//     controller(async (req, res, next) => {
//         const { uuid, petiType, message } = req.body;

//         const result = await pgPool.query(
//             `INSERT INTO
//                 chat
//                     (result_uuid, peti_eng_name, message)
//                 VALUES
//                     ($1, $2, $3) RETURNING idx`,
//             [uuid, petiType, message]
//         );

//         const idx = result.rows[0].idx;

//         res.status(200).send({ lastIdx: idx });
//     })
// );
// 채팅방 메시지 조회 API

chatRouter.get(
    '/messages/:petiType',
    chatGetValidation,
    controller(async (req, res, next) => {
        const { lastIdx } = req.query;
        const { petiType } = req.params;
        const limit = 50;
        let query;

        if (lastIdx) {
            query = `
                SELECT 
                    peti_eng_name AS "petiType",
                    message
                FROM 
                    chat 
                WHERE 
                    peti_eng_name = $1 AND idx <= $2 
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
        res.status(200).json(messages.rows);
    })
);
module.exports = chatRouter;
