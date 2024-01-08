const resultRouter = require('express').Router();
const { postgre } = require('../config/database/postgre');
const calculateResult = require('../models/typeCalculations');
const { selectTypeDescription } = require('../models/selectTypeDescription');
const { selectTypeChemistry } = require('../models/selectTypeChemistry');
const updatePetiResult = require('../models/updatePetiResult');
const uuid4 = require('uuid4');
const getRedisClient = require('../config/redisConfig');

resultRouter.post('/', async (req, res, next) => {
    const { arrayResponses, pet_name, pet_type, pet_img } = req.body;
    let conn = null;
    let calculationResults = null;
    const uuid = uuid4().replace(/-/g, '').substring(0, 10); // - 없앤 10글자
    const redisClient = getRedisClient();
    let typeScores = {};
    let typePercentages = {};
    const userScores = [];

    const result = {
        success: false,
        message: null,
    };

    try {
        if (!arrayResponses || !pet_name || !pet_type) {
            result.message = 'Please enter the data';
            return res.status(400).send(result);
        }

        conn = await postgre.connect();

        const key = `questions:${pet_type}:${pet_name}`;
        const questionList = await redisClient.lRange(key, 0, -1);
        const typeRanges = {
            활동성: { start: 1, end: 5 },
            식탐성: { start: 6, end: 10 },
            사교성: { start: 11, end: 15 },
            애교성: { start: 16, end: 20 },
        };

        const typeScores = {
            활동성: { userScore: 0, maxScore: 0, minScore: 0 },
            식탐성: { userScore: 0, maxScore: 0, minScore: 0 },
            사교성: { userScore: 0, maxScore: 0, minScore: 0 },
            애교성: { userScore: 0, maxScore: 0, minScore: 0 },
        };
        // console.log(arrayResponses);
        // console.log('questionList : ', questionList);

        //질문을 idx 순서대로 정렬
        const questionWeights = questionList
            .map((q) => JSON.parse(q))
            .sort((a, b) => a.idx - b.idx) // 질문을 idx 기준으로 정렬
            .map((q) => {
                // typeScores 객체 만들기
                if (!typeScores[q.question_type]) {
                    typeScores[q.question_type] = { userScore: 0, maxScore: 0, minScore: 0 };
                }
                return { idx: q.idx, weight: q.weight, type: q.question_type };
            });
        // console.log(questionWeights);

        //프론트에서 받은 결과 값을 idx 순서대로 정렬
        const sortedResponses = arrayResponses.flat().sort((a, b) => a.idx - b.idx);
        // console.log(sortedResponses);

        questionWeights.forEach((question) => {
            const response = sortedResponses.find((r) => r.idx === question.idx);
            if (response) {
                const userScore = response.response * question.weight;
                userScores.push({ type: question.type, score: userScore });
            }
        });

        console.log(userScores);

        Object.keys(typeRanges).forEach((type) => {
            const scores = userScores.filter((score) => score.type === type).map((score) => score.score);
            typeScores[type].userScore = scores.reduce((acc, score) => acc + score, 0);
        });

        Object.keys(typeScores).forEach((type) => {
            const scores = typeScores[type];
            const percentage = ((scores.userScore - scores.minScore) / (scores.maxScore - scores.minScore)) * 100;
            typePercentages[type] = percentage;
        });

        result.success = true;
        res.status(200).send(result);
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
