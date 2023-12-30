const accountRouter = require('express').Router();
const { postgre } = require('../config/database/postgre');

accountRouter.post('/', async (req, res, next) => {
    const { id, pet_name, pet_type, pet_img } = req.body;
    let conn = null;
    const result = {
        success: false,
        message: null,
        data: null,
    };

    try {
        conn = await postgre.connect();
        const sql = 'INSERT INTO account (id, pet_name, pet_type, pet_img) VALUES ($1, $2, $3, $4)';
        const data = [id, pet_name, pet_type, pet_img];
        const user = await postgre.query(sql, data);
        const row = user.rows;
        result.data = row;
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

module.exports = accountRouter;
