const resultRouter = require('express').Router();
const { postgre } = require('../config/database/postgre');
const uuid4 = require('uuid4');

const { BadRequestException } = require('../module/Exception');

resultRouter.post('/', async (req, res, next) => {
    const { arrayResponses, petName, petType, petImg } = req.body;
    let conn = null;
    const uuid = uuid4().replace(/-/g, '').substring(0, 10); // - 없앤 10글자
    const groupedResponses = [];
    const sumsOfGroupedResponses = [];
    const questionWeightArray = [];

    try {
        if (!arrayResponses || !petName || !petType) {
            return next(new BadRequestException('value is invalid'));
        }
        conn = await postgre.connect();

        //프론트에서 받은 결과 값을 idx 순서대로 정렬
        const sortedResponses = arrayResponses.flat().sort((start, end) => start.idx - end.idx);
        const arrayResponsess = sortedResponses.map((client) => client.response);
        const minIdx = Math.min(...sortedResponses.map((min) => min.idx));
        const maxIdx = Math.max(...sortedResponses.map((max) => max.idx));

        const queryResult = await postgre.query(
            `SELECT 
                idx AS "idx",
                weight AS "weight"
            FROM 
                peti_question 
            WHERE 
                idx BETWEEN $1 AND $2
            ORDER BY 
                idx ASC`,
            [minIdx, maxIdx]
        );

        //DB에 저장된 질문의 weight만 가져오기
        const questionWeight = queryResult.rows.map((question) => question.weight / 2);
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
        console.log(questionWeightArray);

        //가중치를 가지고 최대가능점수 계산
        const maxSum = questionWeightArray.slice(0, 4).map((group) => group.reduce((sum, num) => sum + num * 3, 0));
        const minusSum = questionWeightArray.slice(0, 4).map((group) => group.reduce((sum, num) => sum + num * -3, 0));

        //각 유형별 가중치 계산
        const weightPercentages = sumsOfGroupedResponses.map((userScore, index) => {
            const maxScore = maxSum[index];
            const minScore = minusSum[index];
            return ((userScore - minScore) / (maxScore - minScore)) * 100;
        });

        console.log(weightPercentages);

        res.status(200).send({
            uuid: uuid,
        });
    } catch (error) {
        return next(error);
    } finally {
        if (conn) {
            conn.end();
        }
    }
});

resultRouter.get('/user', async (req, res, next) => {});

//위 post api는 계산에 대한 부분을 수정해야한다..... 제대로 수정하자 하나하나 차근차근 수정해보자.. 내가 봤을 때 계산 부분을 좀 합칠 필요가 있다.

module.exports = resultRouter;

// 20,  13, -15, 10, -14,
// 20,  11, 11, -12,  14,
//20,  14, 15, -15, 12,
//20, -15, 14,  14, 11
// ]
// [
//   [ 1, 1, -2, 3, -1 ],
//   [ -1, -3, -1, 2, -2 ],
//   [ -1, -2, 3, -2, 1 ],
//   [ 1, 3, -1, 2, 1 ]

// 20, 13,30,30,14,
// -20, -33, -11, -24, -28
//-20, -28, 45, 30, 12
// 20 , -45, -14, 28, 11

// 107, -116, 39, 0

// [
//     [ 10, 3.5, 7.5, 5, 7 ],
//     [ 10, 2.5, 5.5, 6, 7 ],
//     [ 10, 2, 3.5, 3.5, 6 ],
//     [ 10, 5.5, 1, 2, 3.5 ]
//   ]
