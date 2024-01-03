const redis = require('redis');

const getRedisClient = () => {
    const client = redis.createClient({
        url: 'redis://localhost:6379', // Redis 서버 URL
    });
    client.connect(); // Redis 클라이언트 연결
    return client;
};

module.exports = getRedisClient;
