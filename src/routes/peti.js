const petiRouter = require('express').Router();
const { pgPool } = require('../config/database/postgre');
const controller = require('../module/controller');

petiRouter.get(
    '/peti/all',
    controller(async (req, res) => {
        const sql = `SELECT 
                        peti_eng_name AS "nameEn",
                        peti_kor_name AS "nameKr",
                        summary AS "propensity",
                        description AS "typeDescription"
                    FROM 
                        peti 
                    `;
        const result = await pgPool.query(sql);

        res.status(200).send(result.rows);
    })
);

module.exports = petiRouter;
