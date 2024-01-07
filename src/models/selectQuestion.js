const { postgre } = require('../config/database/postgre');
const getRedisClient = require('../config/redisConfig');

//peti_question 테이블에 있는 질문들을 가지고 오는 함수
async function getQuestions(type, pet_name) {
    const redisClient = getRedisClient();
    let conn = null;
    try {
        conn = await postgre.connect();
        const idxRange = type === 'dog' ? 'AND idx BETWEEN 1 AND 20' : 'AND idx BETWEEN 21 AND 40';
        const key = `questions:${type}:${pet_name}`;
        const keyExists = await redisClient.exists(key);
        // 키가 존재하면 데이터를 삭제
        if (!keyExists) {
            //질문을 찾는 쿼리문
            const queryText = `SELECT * FROM peti_question WHERE type = $1 ${idxRange} ORDER BY RANDOM()`;
            const queryParams = [type];
            const { rows } = await postgre.query(queryText, queryParams);
            // 섞은 질문을 Redis에 저장
            const addPromises = rows.map((row) => redisClient.rPush(key, JSON.stringify(row)));
            const result = await Promise.all(addPromises); // map때문에 사용
            await redisClient.expire(key, 3600); //1시간 후에 없어짐
            console.log(result);
            return rows;
        }
    } catch (error) {
        throw error;
    } finally {
        if (conn) {
            conn.end();
        }
        await redisClient.quit();
    }
}
module.exports = getQuestions;
