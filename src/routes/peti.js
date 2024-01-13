const petiRouter = require('express').Router();
const { postgre } = require('../config/database/postgre');

petiRouter.get('/all', async (req, res) => {
    let conn = null;

    try {
        conn = await postgre.connect();

        const sql = `SELECT 
                        peti_eng_name AS "nameEn",
                        peti_kor_name AS "nameKr",
                        summary AS "propensity",
                        description AS "typeDescription"
                    FROM 
                        peti 
                    `;
        const result = await postgre.query(sql);

        res.status(200).send(result.rows);
    } catch (error) {
        console.log(error);
    } finally {
        if (conn) {
            conn.end();
        }
    }
});

module.exports = petiRouter;
