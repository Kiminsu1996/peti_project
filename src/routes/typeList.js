const typeListRouter = require('express').Router();
const { pgPool } = require('../config/database/postgre');
const type = require('../../type.json');
const controller = require('../module/controller');

typeListRouter.post(
    '/',
    controller(async (req, res) => {
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
            await pgPool.query(typeSql, typeValue);
        }
        res.send('성공');
    })
);
module.exports = typeListRouter;
