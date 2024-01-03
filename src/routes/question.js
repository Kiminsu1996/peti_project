const questionRouter = require('express').Router();
const getQuestions = require('../models/selectQuestion');
const getRedisClient = require('../config/redisConfig');
const authGuard = require('../middleware/authGuard');

questionRouter.get('/dog', authGuard, async (req, res, next) => {
    const userId = req.user.id;
    const result = {
        success: false,
        data: null,
    };

    try {
        let page = parseInt(req.query.page || 1);
        const itemsPerPage = 5;
        const type = 'dog'; // 질문 타입
        const key = `questions:${type}:${userId}`; // Redis 키
        const redisClient = getRedisClient();

        // 페이지 값이 숫자가 아니거나 1 미만일 경우 에러 메시지를 반환
        if (isNaN(page) || page < 1) {
            result.message = 'Page not found';
            return res.status(400).send(result);
        }

        await getQuestions(type, userId);

        //redis에 저장된 질문 가져오고 파싱
        const redisData = await redisClient.sMembers(key);
        const formattedData = redisData.map((item) => JSON.parse(item));

        //페이지 결정
        const pageStart = (page - 1) * itemsPerPage;
        const pageEnd = pageStart + itemsPerPage;
        const paginatedData = formattedData.slice(pageStart, pageEnd);

        if (!paginatedData || paginatedData.length === 0) {
            result.message = 'Page not found';
            return res.status(404).send(result);
        } else {
            result.success = true;
            result.data = paginatedData;
            res.status(200).send(result);
        }
    } catch (error) {
        return next(error);
    }
});

questionRouter.get('/cat', authGuard, async (req, res, next) => {
    const userId = req.user.id;
    const result = {
        success: false,
        data: null,
    };

    try {
        let page = parseInt(req.query.page || 1);
        const itemsPerPage = 5;
        const type = 'cat'; // 질문 타입
        const key = `questions:${type}:${userId}`; // Redis 키
        const redisClient = getRedisClient();

        // 페이지 값이 숫자가 아니거나 1 미만일 경우 에러 메시지를 반환
        if (isNaN(page) || page < 1) {
            result.message = 'Page not found';
            return res.status(400).send(result);
        }

        await getQuestions(type, userId);

        //redis에 저장된 질문 가져오고 파싱
        const redisData = await redisClient.sMembers(key);
        const formattedData = redisData.map((item) => JSON.parse(item));

        //페이지 결정
        const pageStart = (page - 1) * itemsPerPage;
        const pageEnd = pageStart + itemsPerPage;
        const paginatedData = formattedData.slice(pageStart, pageEnd);

        if (!paginatedData || paginatedData.length === 0) {
            result.message = 'Page not found';
            return res.status(404).send(result);
        } else {
            result.success = true;
            result.data = paginatedData;
            res.status(200).send(result);
        }
    } catch (error) {
        return next(error);
    }
});

module.exports = questionRouter;
