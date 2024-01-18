const resultRouter = require('express').Router();
const { pgPool } = require('../config/database/postgre');
const uuid4 = require('uuid4');
const { returnAlphbet } = require('../module/calculateAlphabet');
const { resultPostValidation, resultGetValidation } = require('../module/validate');
const controller = require('../module/controller');
const calculateResult = require('../module/calculateResult');

//peti를 계산하는 api
resultRouter.post(
    '/peti',
    resultPostValidation,
    controller(async (req, res, next) => {
        const { qusetionAnswerlist, petName, petType, petImg } = req.body;
        const uuid = uuid4().replace(/-/g, '').substring(0, 10); // - 없앤 10글자

        //프론트에서 받은 결과 값을 idx 순서대로 정렬
        const userValue = qusetionAnswerlist.sort((start, end) => start.idx - end.idx);
        const minIdx = Math.min(...userValue.map((min) => min.idx));
        const maxIdx = Math.max(...userValue.map((max) => max.idx));

        const queryResult = await pgPool.query(
            `SELECT 
                idx AS "idx",
                weight AS "weight"
            FROM 
                question 
            WHERE 
                idx BETWEEN $1 AND $2
            ORDER BY 
                idx ASC`,
            [minIdx, maxIdx]
        );

        const percentValue = calculateResult(qusetionAnswerlist, queryResult);
        const proportions = returnAlphbet(percentValue, userValue);

        // peti 검사유형 단어조합
        const peti = `${proportions.aProportion}${proportions.eProportion}${proportions.cProportion}${proportions.lProportion}`;

        const petiResult = `INSERT INTO
                                result
                                    (uuid, peti_eng_name, a_proportion, e_proportion, c_proportion, l_proportion, pet_name, pet_type, pet_img)
                                VALUES
                                    ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
        const value = [
            uuid,
            peti,
            weightPercentages[0],
            weightPercentages[1],
            weightPercentages[2],
            weightPercentages[3],
            petName,
            petType,
            petImg,
        ];
        await pgPool.query(petiResult, value);

        res.status(200).send({ uuid: uuid });
    })
);

//peti 결과를 보여주는 api
resultRouter.get(
    '/peti/result/:uuid',
    resultGetValidation,
    controller(async (req, res) => {
        const { uuid } = req.params;
        const resultQuery = `
                            SELECT
                                result.pet_name AS "name",
                                result.pet_img AS "profileImg",
                                result.a_proportion AS "a_percent",
                                result.e_proportion AS "e_percent",
                                result.c_proportion AS "c_percent",
                                result.l_proportion AS "l_percent",
                                result.peti_eng_name AS "nameEn",
                                peti.peti_kor_name AS "nameKr",
                                peti.compatible AS "compatibleEn",
                                peti_compatible.peti_kor_name AS "compatibleKr", 
                                peti.incompatible AS "incompatibleEn",
                                peti_incompatible.peti_kor_name AS "incompatibleKr",
                                peti.summary AS "propensity",
                                peti.description AS "typeDescription"
                            FROM 
                                result
                            JOIN 
                                peti ON result.peti_eng_name = peti.peti_eng_name
                            LEFT JOIN 
                                peti peti_compatible ON peti.compatible = peti_compatible.peti_eng_name
                            LEFT JOIN 
                                peti peti_incompatible ON peti.incompatible = peti_incompatible.peti_eng_name
                            WHERE 
                                result.uuid = $1`;
        const finalResult = await pgPool.query(resultQuery, [uuid]);
        const typeResult = await pgPool.query(`SELECT * FROM type`);

        res.status(200).send({
            pet: {
                name: finalResult.rows[0].name,
                profileImg: finalResult.rows[0].profileImg,
            },
            resultList: [
                {
                    petiTypeList: [
                        {
                            nameKr: finalResult.rows[0].nameKr,
                            nameEn: finalResult.rows[0].nameEn,
                            compatibleKr: finalResult.rows[0].compatibleKr,
                            compatibleEn: finalResult.rows[0].compatibleEn,
                            incompatibleKr: finalResult.rows[0].incompatibleKr,
                            incompatibleEn: finalResult.rows[0].incompatibleEn,
                            propensity: finalResult.rows[0].propensity,
                            typeDescription: finalResult.rows[0].typeDescription,
                        },
                    ],
                    petiTypeElementList: [
                        {
                            nameKr: typeResult.rows[0].element_kr,
                            leftCharacterKr: typeResult.rows[0].left_character_kr,
                            leftCharacterEn: typeResult.rows[0].left_character_en,
                            leftcharacterAlphabet: typeResult.rows[0].left_character_alphabet,
                            rightCharacterKr: typeResult.rows[0].right_character_kr,
                            rightCharacterEn: typeResult.rows[0].right_character_en,
                            rightcharacterAlphabet: typeResult.rows[0].right_character_alphabet,
                            a_percent: finalResult.rows[0].a_percent,
                        },
                        {
                            nameKr: typeResult.rows[1].element_kr,
                            leftCharacterKr: typeResult.rows[1].left_character_kr,
                            leftCharacterEn: typeResult.rows[1].left_character_en,
                            leftcharacterAlphabet: typeResult.rows[1].left_character_alphabet,
                            rightCharacterKr: typeResult.rows[1].right_character_kr,
                            rightCharacterEn: typeResult.rows[1].right_character_en,
                            rightcharacterAlphabet: typeResult.rows[1].right_character_alphabet,
                            e_percent: finalResult.rows[0].e_percent,
                        },
                        {
                            nameKr: typeResult.rows[2].element_kr,
                            leftCharacterKr: typeResult.rows[2].left_character_kr,
                            leftCharacterEn: typeResult.rows[2].left_character_en,
                            leftcharacterAlphabet: typeResult.rows[2].left_character_alphabet,
                            rightCharacterKr: typeResult.rows[2].right_character_kr,
                            rightCharacterEn: typeResult.rows[2].right_character_en,
                            rightcharacterAlphabet: typeResult.rows[2].right_character_alphabet,
                            c_percent: finalResult.rows[0].c_percent,
                        },
                        {
                            nameKr: typeResult.rows[3].element_kr,
                            leftCharacterKr: typeResult.rows[3].left_character_kr,
                            leftCharacterEn: typeResult.rows[3].left_character_en,
                            leftcharacterAlphabet: typeResult.rows[3].left_character_alphabet,
                            rightCharacterKr: typeResult.rows[3].right_character_kr,
                            rightCharacterEn: typeResult.rows[3].right_character_en,
                            rightcharacterAlphabet: typeResult.rows[3].right_character_alphabet,
                            l_percent: finalResult.rows[0].l_percent,
                        },
                    ],
                },
            ],
        });
    })
);
module.exports = resultRouter;
