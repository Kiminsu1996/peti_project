const { postgre } = require('../config/database/postgre');

const selectTypeDescription = async (petiType) => {
    let conn = null;
    try {
        conn = await postgre.connect();
        const sql = 'SELECT peti_propensity, peti_description FROM type_description WHERE peti_type = $1';
        const result = await postgre.query(sql, [petiType]);
        return result.rows[0];
    } catch (error) {
        throw error;
    } finally {
        if (conn) {
            conn.end();
        }
    }
};

module.exports = {
    selectTypeDescription,
};
