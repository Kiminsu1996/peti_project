const { postgre } = require('../config/database/postgre');

const updatePetiResult = async (
    id,
    petiType,
    aProportion,
    eProportion,
    cProportion,
    lProportion,
    peti_propensity,
    peti_description,
    compatible_type,
    incompatible_type
) => {
    let conn = null;
    const sql = `
    UPDATE peti_result
    SET
      peti_type = $1,
      a_proportion = $2,
      e_proportion = $3,
      c_proportion = $4,
      l_proportion = $5,
      peti_propensity = $6,
      peti_description = $7,
      compatible_type = $8,
      incompatible_type = $9
    WHERE id = $10;
  `;

    try {
        conn = await postgre.connect();
        const result = await postgre.query(sql, [
            petiType,
            aProportion,
            eProportion,
            cProportion,
            lProportion,
            peti_propensity,
            peti_description,
            compatible_type,
            incompatible_type,
            id,
        ]);
        return result;
    } catch (error) {
        throw error;
    } finally {
        if (conn) {
            conn.end();
        }
    }
};

module.exports = updatePetiResult;
