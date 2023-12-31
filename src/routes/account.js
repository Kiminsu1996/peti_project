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

// const { postgre } = require('../config/database/postgre');

// async function getQuestions(type, page, itemsPerPage) {
//     const conn = await postgre.connect();
//     try {
//         const startIdx = (page - 1) * itemsPerPage + 1;
//         const endIdx = page * itemsPerPage;
//         const sql = `SELECT * FROM peti_question WHERE ${type}_question IS NOT NULL AND idx BETWEEN $1 AND $2 ORDER BY RANDOM()`;
//         const { rows } = await postgre.query(sql, [startIdx, endIdx]);
//         return rows;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     } finally {
//         conn.end();
//     }
// }

// module.exports = { getQuestions };
// javascript
// Copy code
// // routes/questionRouter.js
// const questionRouter = require('express').Router();
// const questionModel = require('../models/questionModel');

// questionRouter.get('/dog', async (req, res) => {
//     try {
//         const page = parseInt(req.query.page || 1);
//         const itemsPerPage = 5;
//         const questions = await questionModel.getQuestions('dog', page, itemsPerPage);
//         res.send({ success: true, data: questions });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ success: false, message: 'Server error' });
//     }
// });

// questionRouter.get('/cat', async (req, res) => {
//     try {
//         const page = parseInt(req.query.page || 1);
//         const itemsPerPage = 5;
//         const questions = await questionModel.getQuestions('cat', page, itemsPerPage);
//         res.send({ success: true, data: questions });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ success: false, message: 'Server error' });
//     }
// });

// module.exports = questionRouter;
