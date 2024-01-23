const { pgPool } = require('../config/database/postgre');

async function saveChatMessage(message, uuid, petiType) {
    try {
        await pgPool.query(`INSERT INTO chat (result_uuid, peti_eng_name, message) VALUES ($1, $2, $3)RETURNING idx`, [
            uuid,
            petiType,
            message,
        ]);
    } catch (error) {
        throw error;
    }
}

module.exports = { saveChatMessage };
