const typeListRouter = require('express').Router();
const { postgre } = require('../config/database/postgre');
const type = require('../../type.json');

typeListRouter.post('/', async (req, res) => {
    let conn = null;

    try {
        conn = await postgre.connect();

        for (let i = 0; i < 3; i++) {
            const typeSql = `INSERT INTO
                                type
                                    (idx, element_en, element_kr, left_character_en, left_character_kr, left_character_alphabet, right_character_en, right_character_kr, right_character_alphabet)
                                VALUES
                                    ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
            const typeValue = [
                type[i].idx,
                type[i].elementEng,
                type[i].elementKor,
                type[i].leftCharacterEng,
                type[i].leftCharacterKor,
                type[i].leftAlphabet,
                type[i].rightCharacterEng,
                type[i].rightCharacterKor,
                type[i].rightAlphabet,
            ];
            await postgre.query(typeSql, typeValue);
        }
        res.send('성공');
    } catch (error) {
        console.log(error);
    } finally {
        if (conn) {
            conn.end();
        }
    }
});

module.exports = typeListRouter;
