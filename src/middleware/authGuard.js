const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

const verifyToken = (req, res, next) => {
    const token = req.headers.token;

    if (!token) {
        return res.status(400).send({ message: 'No token' });
    }

    try {
        const decoded = jwt.verify(token, jwtConfig.secret);
        req.user = decoded;
    } catch (error) {
        throw error;
    }

    return next(); // 검증 성공시 다음 미들웨어로 이동
};

module.exports = verifyToken;
