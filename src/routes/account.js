const accountRouter = require('express').Router();
const { postgre } = require('../config/database/postgre');
const uuidv4 = require('uuid4');

accountRouter.post('/', async (req, res, next) => {
    const { pet_name, pet_type, pet_img } = req.body;
    const id = uuidv4().substring(0, 10);
    let conn = null;
    const result = {
        success: false,
        message: null,
        id: null,
    };

    try {
        if (!pet_name || !pet_type) {
            result.message = 'Please enter the data';
            return res.status(400).send(result);
        }

        conn = await postgre.connect();
        const sql = 'INSERT INTO peti_result (id, pet_name, pet_type, pet_img) VALUES ($1, $2, $3, $4)';
        const data = [id, pet_name, pet_type, pet_img || null];
        await postgre.query(sql, data);
        result.success = true;
        result.id = id;
        res.status(200).send(result);
    } catch (error) {
        return next(error);
    } finally {
        if (conn) {
            conn.end();
        }
    }
});

module.exports = accountRouter;
