const typeListRouter = require('express').Router();
const { postgre } = require('../config/database/postgre');
const type = require('../../type.json');

typeListRouter.post('/', async (req, res) => {
    let conn = null;

    try {
        conn = await postgre.connect();

        for (let i = 0; i < 8; i++) {
            const typeSql = `INSERT INTO
                                type
                                    (idx, element_eng, element_kor, character_eng, character_kor)
                                VALUES
                                    ($1, $2, $3, $4, $5)`;
            const typeValue = [type[i].idx, type[i].elementEng, type[i].elementKor, type[i].characterEng, type[i].characterKor];
            await postgre.query(typeSql, typeValue);
        }
        res.send('성공');
    } catch (error) {
        console.log(error);
    } finally {
        if (conn) {
            conn.end();
        }
    }
});

module.exports = typeListRouter;
