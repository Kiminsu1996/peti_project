const { pgPool } = require('../config/database/postgre');
const controller = require('./controller');

const saveChatMessage = controller(async (message, uuid, petiType) => {
    await pgPool.query(`INSERT INTO chat (result_uuid, peti_eng_name, message) VALUES ($1, $2, $3) RETURNING idx`, [
        uuid,
        petiType,
        message,
    ]);
});

module.exports = {
    saveChatMessage,
};
