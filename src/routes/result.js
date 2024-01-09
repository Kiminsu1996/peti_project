const resultRouter = require('express').Router();
const { postgre } = require('../config/database/postgre');
const uuid4 = require('uuid4');

const { BadRequestException } = require('../module/Exception');

resultRouter.post('/', async (req, res, next) => {
    const { arrayResponses, petName, petType, petImg } = req.body;
    let conn = null;
    const uuid = uuid4().replace(/-/g, '').substring(0, 10); // - 없앤 10글자

    try {
        if (!arrayResponses || !petName || !petType) {
            return next(new BadRequestException('value is invalid'));
        }
        conn = await postgre.connect();

        //프론트에서 받은 결과 값을 idx 순서대로 정렬
        const sortedResponses = arrayResponses.flat().sort((a, b) => a.idx - b.idx);
        const arrayResponsess = sortedResponses.map((r) => r.response);
        const minIdx = Math.min(...sortedResponses.map((r) => r.idx));
        const maxIdx = Math.max(...sortedResponses.map((r) => r.idx));

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

        const questionWeight = queryResult.rows.map((r) => r.weight);

        const groupedResponses = arrayResponsess.reduce((acc, response, index) => {
            const groupIndex = Math.floor(index / 5); // 5개씩 그룹을 만들기 위한 인덱스 계산

            if (!acc[groupIndex]) {
                acc[groupIndex] = []; // 새 그룹 생성
            }

            acc[groupIndex].push(response); // 현재 그룹에 요소 추가
            return acc;
        }, []);

        console.log(groupedResponses);

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
