const typeRouter = require('express').Router();
const { pgPool } = require('../config/database/postgre');
const controller = require('../module/controller');

typeRouter.get(
    '/peti/type/all',
    controller(async (req, res) => {
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
module.exports = typeRouter;
