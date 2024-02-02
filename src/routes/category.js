const categoryRouter = require('express').Router();
const { pgPool } = require('../config/database/postgre');
const controller = require('../controller/controller');
const { logging } = require('../module/logging');

categoryRouter.get(
    '/type/all',
    controller(async (req, res, next) => {
        const sql = `SELECT 
                        element_kr AS "nameKr",
                        element_en AS "nameEn",
                        left_character_kr AS "leftCharacterKr",
                        left_character_en AS "leftCharacterEn",
                        left_character_alphabet AS "leftcharacterAlphabet",
                        right_character_kr AS "rightCharacterKr",
                        right_character_en AS "rightCharacterEn",
                        right_character_alphabet AS "rightcharacterAlphabet"
                    FROM 
                        type 
                    ORDER BY idx ASC`;
        const result = await pgPool.query(sql);
        res.status(200).send(result.rows);
    })
);

categoryRouter.get(
    '/all',
    controller(async (req, res, next) => {
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

module.exports = categoryRouter;
