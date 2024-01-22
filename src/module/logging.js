const { client } = require('../config/database/mongo');
const controller = require('../controller/controller');

const logging = controller(async (req, res, next) => {
    const database = client.db('peti');
    const collection = database.collection('logging');

    // 로그 데이터 삽입 예제
    const logData = {
        api: req.url,
        timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }),
    };

    await collection.insertOne(logData);
});

module.exports = { logging };
