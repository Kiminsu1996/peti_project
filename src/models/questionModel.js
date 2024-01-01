const { postgre } = require('../config/database/postgre');

async function getQuestions(type, page, itemsPerPage) {
    const conn = await postgre.connect();
    try {
        const startIdx = (page - 1) * itemsPerPage + 1;
        const endIdx = page * itemsPerPage;
        const sql = `SELECT * FROM peti_question WHERE ${type}_question IS NOT NULL AND idx BETWEEN $1 AND $2 ORDER BY RANDOM()`;
        const { rows } = await postgre.query(sql, [startIdx, endIdx]);
        return rows;
    } catch (error) {
        throw error;
    } finally {
        conn.end();
    }
}

module.exports = { getQuestions };
