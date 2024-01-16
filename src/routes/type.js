const typeRouter = require('express').Router();
const { postgre } = require('../config/database/postgre');

typeRouter.get('/peti/type/all', async (req, res) => {
    try {
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
        const result = await postgre.query(sql);

        res.status(200).send(result.rows);
    } catch (error) {
        console.log(error);
    }
});

module.exports = typeRouter;
