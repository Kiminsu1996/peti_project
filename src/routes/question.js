const questionRouter = require('express').Router();
const { postgre } = require('../config/database/postgre');

questionRouter.get('/dog', async (req, res) => {
    let conn = null;
    const result = {
        success: false,
        data: null,
    };

    const page = parseInt(req.query.page || 1); // 기본값은 1페이지
    const itemsPerPage = 5; // 페이지당 항목 수는 5개

    try {
        conn = await postgre.connect();

        const startIdx = (page - 1) * itemsPerPage + 1;
        const endIdx = page * itemsPerPage;

        const sql = `SELECT * FROM peti_question WHERE dog_question IS NOT NULL AND idx BETWEEN $1 AND $2 ORDER BY RANDOM()`;
        const params = [startIdx, endIdx];
        const { rows } = await postgre.query(sql, params);
        result.data = rows;
        result.success = true;
        res.send(result);
    } catch (error) {
        console.log(error);
    } finally {
        if (conn) {
            conn.end();
        }
    }
});

questionRouter.get('/cat', async (req, res) => {
    let conn = null;
    const result = {
        success: false,
        data: null,
    };

    const page = parseInt(req.query.page || 1); // 기본값은 1페이지
    const itemsPerPage = 5; // 페이지당 항목 수는 5개

    try {
        conn = await postgre.connect();

        const startIdx = (page - 1) * itemsPerPage + 1;
        const endIdx = page * itemsPerPage;

        const sql = `SELECT * FROM peti_question WHERE cat_question IS NOT NULL AND idx BETWEEN $1 AND $2 ORDER BY RANDOM()`;
        const params = [startIdx, endIdx];
        const { rows } = await postgre.query(sql, params);
        result.data = rows;
        result.success = true;
        res.send(result);
    } catch (error) {
        console.log(error);
    } finally {
        if (conn) {
            conn.end();
        }
    }
});

module.exports = questionRouter;
