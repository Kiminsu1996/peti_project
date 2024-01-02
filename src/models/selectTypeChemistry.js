const { postgre } = require('../config/database/postgre');

const selectTypeChemistry = async (petiType) => {
    let conn = null;
    try {
        conn = await postgre.connect();
        const sql = 'SELECT compatible_type, incompatible_type FROM type_chemistry WHERE peti_type = $1';
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
    selectTypeChemistry,
};
