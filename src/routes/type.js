const typeRouter = require('express').Router();
const { postgre } = require('../config/database/postgre');

typeRouter.get('/', async (req, res) => {
    let conn = null;

    try {
        conn = await postgre.connect();

        const sql = `SELECT * FROM type ORDER BY idx ASC`;
        const result = await postgre.query(sql);

        res.status(200).send(result.rows);
    } catch (error) {
        console.log(error);
    } finally {
        if (conn) {
            conn.end();
        }
    }
});

module.exports = typeRouter;
