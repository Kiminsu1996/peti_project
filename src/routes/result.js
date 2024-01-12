const resultRouter = require('express').Router();
const { postgre } = require('../config/database/postgre');
const uuid4 = require('uuid4');

const { BadRequestException } = require('../module/Exception');
const { returnAlphbet } = require('../module/cal');

resultRouter.post('/', async (req, res, next) => {
    const { arrayResponses, petName, petType, petImg } = req.body;
    let conn = null;
    const uuid = uuid4().replace(/-/g, '').substring(0, 10); // - 없앤 10글자
    const groupedResponses = [];
    const sumsOfGroupedResponses = [];
    const questionWeightArray = [];
    let peti = null;
    try {
        if (!arrayResponses || !petName || !petType) {
            return next(new BadRequestException('value is invalid'));
        }

        //예외처리 더 빡시게 하기

        conn = await postgre.connect();

        //프론트에서 받은 결과 값을 idx 순서대로 정렬
        const sortedResponses = arrayResponses.sort((start, end) => start.idx - end.idx);
        const arrayResponsess = sortedResponses.map((client) => client.response);
        const minIdx = Math.min(...sortedResponses.map((min) => min.idx));
        const maxIdx = Math.max(...sortedResponses.map((max) => max.idx));

        // console.log(sortedResponses);

        const queryResult = await postgre.query(
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

        //DB에 저장된 질문의 weight만 가져오기
        const questionWeight = queryResult.rows.map((question) => question.weight / 10);
        // arrayResponsess(프론트 값) 과 questionWeight(DB의 weight값) 을 idx 별로 곲하기
        const multipliedResponses = arrayResponsess.map((response, index) => response * questionWeight[index]);

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
        const proportions = returnAlphbet(weightPercentages);

        // peti 검사유형 단어조합
        peti = `${proportions.aProportion}${proportions.eProportion}${proportions.cProportion}${proportions.lProportion}`;

        const petiResult = `INSERT INTO
                                result
                                    (peti_eng_name, uuid, a_proportion, e_proportion, c_proportion, l_proportion, pet_name, pet_type, pet_img)
                                VALUES
                                    ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
        const value = [
            peti,
            uuid,
            weightPercentages[0],
            weightPercentages[1],
            weightPercentages[2],
            weightPercentages[3],
            petName,
            petType,
            petImg,
        ];
        await postgre.query(petiResult, value);

        const resultQuery = `
                            SELECT
                                result.idx,
                                result.pet_name,
                                result.pet_type,
                                result.pet_img,
                                result.a_proportion,
                                result.e_proportion,
                                result.c_proportion,
                                result.l_proportion,
                                result.uuid,
                                result.peti_eng_name AS peti_type,
                                peti.peti_kor_name,
                                peti.compatible,
                                peti_compatible.peti_kor_name AS compatible_kor_name, 
                                peti.incompatible,
                                peti_incompatible.peti_kor_name AS incompatible_kor_name,
                                peti.summary,
                                peti.description
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
        const finalResult = await postgre.query(resultQuery, [uuid]);

        res.status(200).send({
            result: {
                success: true,
                data: finalResult.rows,
            },
        });
    } catch (error) {
        return next(error);
    } finally {
        if (conn) {
            conn.end();
        }
    }
});

module.exports = resultRouter;
