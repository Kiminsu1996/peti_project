const petiRouter = require('express').Router();
const { postgre } = require('../config/database/postgre');

petiRouter.get('/peti/all', async (req, res) => {
    try {
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
        return next(error);
    }
});

module.exports = petiRouter;
