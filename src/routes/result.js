const resultRouter = require('express').Router();
const { pgPool } = require('../config/database/postgre');
const uuid4 = require('uuid4');
const { returnAlphbet } = require('../module/cal');
const { resultPostValidation, resultGetValidation } = require('../module/validate');
const controller = require('../module/controller');

//peti를 계산하는 api
resultRouter.post(
    '/peti',
    resultPostValidation,
    controller(async (req, res, next) => {
        const { qusetionAnswerlist, petName, petType, petImg } = req.body;
        const uuid = uuid4().replace(/-/g, '').substring(0, 10); // - 없앤 10글자
        const groupedResponses = [];
        const sumsOfGroupedResponses = [];
        const questionWeightArray = [];
        let peti = null;

        //프론트에서 받은 결과 값을 idx 순서대로 정렬
        const sortedResponses = qusetionAnswerlist.sort((start, end) => start.idx - end.idx);
        const arrayResponses = sortedResponses.map((client) => client.response);
        const minIdx = Math.min(...sortedResponses.map((min) => min.idx));
        const maxIdx = Math.max(...sortedResponses.map((max) => max.idx));

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

        // 먼저 프론트에서 받은 값을 idx로 순서대로 나열하고 response 값을 가지고
        // queryResult 값에서 weight /10 의 값과 response의 값을 곱하기
        // 그리고 나서 배열을 5개씩 쪼개기

        // const testResult = (userValue, queryValue) => {
        //     const asd = userValue.sort((start, end) => start.idx - end.idx).map((value) => value.response);
        //     const qwe = queryValue.rows.map((weight) => weight.weight);
        //     let groupedResults = [];
        //     let tempArray = [];

        //     for (let i = 0; i < asd.length; i++) {
        //         tempArray.push(asd[i] * qwe[i]);

        //         if ((i + 1) % 5 === 0 || i === asd.length - 1) {
        //             groupedResults.push(tempArray);
        //             tempArray = [];
        //         }
        //     }

        //     // 각 하위 배열의 합을 계산
        //     const sums = groupedResults.map((group) => group.reduce((sum, value) => sum + value, 0));
        //     return sums;
        // };
        // 여기에 더 + 해야한다.
        // console.log(testResult(sortedResponses, queryResult));

        //DB에 저장된 질문의 weight만 가져오기
        const questionWeight = queryResult.rows.map((question) => question.weight / 10);
        // arrayResponses(프론트 값) 과 questionWeight(DB의 weight값) 을 idx 별로 곲하기
        const multipliedResponses = arrayResponses.map((response, index) => response * questionWeight[index]);

        //idx와 weight의 곱한 값을 5개씩 배열에 저장하기
        for (let i = 0; i < multipliedResponses.length; i += 5) {
            //프론트엔드에서 받은 값을 5개씩 자르기
            const group = multipliedResponses.slice(i, i + 5);
            // 5개씩 자른 배열을 groupedResponses에 추가
            groupedResponses.push(group);
            //각 배열의 합을 sumsOfGroupedResponses에 저장
            const sumOfGroup = group.reduce((sum, value) => sum + value, 0);
            sumsOfGroupedResponses.push(sumOfGroup);
        }

        //가중치를 5개씩 배열에 저장하기
        for (let i = 0; i < questionWeight.length; i += 5) {
            questionWeightArray.push(questionWeight.slice(i, i + 5));
        }

        //가중치를 가지고 최대가능점수 계산
        const maxSum = questionWeightArray.slice(0, 4).map((group) => group.reduce((sum, num) => sum + Math.abs(num) * 3, 0));
        const minusSum = questionWeightArray.slice(0, 4).map((group) => group.reduce((sum, num) => sum + Math.abs(num) * -3, 0));

        //각 유형별 가중치 계산
        const weightPercentages = sumsOfGroupedResponses.map((userScore, index) => {
            const maxScore = maxSum[index];
            const minScore = minusSum[index];
            return parseInt(((userScore - minScore) / (maxScore - minScore)) * 100);
        });
        // 가중치퍼센트 결과를 가지고 유형 검사 weightPercentages
        const proportions = returnAlphbet(weightPercentages, sortedResponses);

        // peti 검사유형 단어조합
        peti = `${proportions.aProportion}${proportions.eProportion}${proportions.cProportion}${proportions.lProportion}`;

        // const petiResult = `INSERT INTO
        //                         result
        //                             (uuid, peti_eng_name, a_proportion, e_proportion, c_proportion, l_proportion, pet_name, pet_type, pet_img)
        //                         VALUES
        //                             ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
        // const value = [
        //     uuid,
        //     peti,
        //     weightPercentages[0],
        //     weightPercentages[1],
        //     weightPercentages[2],
        //     weightPercentages[3],
        //     petName,
        //     petType,
        //     petImg,
        // ];
        // await pgPool.query(petiResult, value);

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
