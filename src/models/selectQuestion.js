const { postgre } = require('../config/database/postgre');
const getRedisClient = require('../config/redisConfig');

//peti_question 테이블에 있는 질문들을 가지고 오는 함수
async function getQuestions(type) {
    const redisClient = getRedisClient();
    let conn = null;
    try {
        conn = await postgre.connect();
        let idxRange = type === 'dog' ? '1 AND 20' : '21 AND 40';
        const key = `questions:${type}`;

        const { rows } = await postgre.query(
            `SELECT * FROM peti_question WHERE ${type}_question IS NOT NULL AND idx BETWEEN ${idxRange} ORDER BY RANDOM()`
        );
        rows.sort(() => Math.random() - 0.5);

        // 섞은 질문을 Redis에 저장
        const addPromises = rows.map((row) => redisClient.sAdd(key, JSON.stringify(row)));
        await Promise.all(addPromises);

        return rows;
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
