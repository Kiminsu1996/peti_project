const chatRouter = require('express').Router();

// 채팅방 메세지 저장 API
chatRouter.post('/', async (req, res, next) => {
    const { result_id, peti_type, message } = req.body;
});

// 채팅방 메시지 조회 API
chatRouter.get('/messages/:peti_type', async (req, res, next) => {
    const { peti_type } = req.params;
});

module.exports = chatRouter;
