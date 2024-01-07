const questionRouter = require('express').Router();
const getQuestions = require('../models/selectQuestion');
const getRedisClient = require('../config/redisConfig');

questionRouter.get('/:type', async (req, res, next) => {
    const pet_name = req.query.pet_name; //동물 이름
    const type = req.params.type; //동물 종류 (강아지, 고양이)
    const result = {
        success: false,
        data: null,
    };

    try {
        let page = parseInt(req.query.page || 1);
        const itemsPerPage = 5;
        const key = `questions:${type}:${pet_name}`; // Redis 키
        const redisClient = getRedisClient();

        // 페이지 값이 숫자가 아니거나 1 미만일 경우 에러 메시지를 반환
        if (isNaN(page) || page < 1) {
            result.message = 'Page not found';
            return res.status(400).send(result);
        }

        if (!pet_name || !type || pet_name === '' || type === '') {
            result.message = 'wrong informaiton';
            return res.status(400).send(result);
        }

        await getQuestions(type, pet_name); //Redis에 질문 저장
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage - 1;

        // Redis에서 데이터 조회
        const questions = await redisClient.lRange(key, start, end);
        if (!questions.length) {
            result.message = 'No more questions';
            return res.status(404).send(result);
        }

        // JSON으로 파싱하여 결과에 추가
        const paginatedData = questions.map((question) => JSON.parse(question));

        result.success = true;
        result.data = paginatedData;
        res.status(200).send(result);
    } catch (error) {
        return next(error);
    }
});

module.exports = questionRouter;
