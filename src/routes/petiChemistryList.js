const petiChemistryRouter = require('express').Router();
const { postgre } = require('../config/database/postgre');

petiChemistryRouter.post('/', async (req, res) => {
    let conn = null;

    const peti_type = [
        'ABEL',
        'ABEC',
        'ABIL',
        'ABIC',
        'ASEL',
        'ASEC',
        'ASIL',
        'ASIC',
        'HBEL',
        'HBEC',
        'HBIL',
        'HBIC',
        'HSEL',
        'HSEC',
        'HSIL',
        'HSIC',
    ];

    const compatible_type = [
        'ASEL',
        'ASEC',
        'HBIL',
        'HBIC',
        'ABEL',
        'ABEC',
        'HBIL',
        'ABIC',
        'HSEL',
        'HSEC',
        'ABIL',
        'ABIC',
        'HBEL',
        'HBEC',
        'ASIL',
        'ASIC',
    ];

    const incompatible_type = [
        'HSIC',
        'HSIL',
        'HSEC',
        'HSEL',
        'HSIC',
        'HSIL',
        'HSEC',
        'HSEL',
        'ASIC',
        'ASIL',
        'ASEC',
        'ASEL',
        'ASIC',
        'ABIL',
        'ASEC',
        'HSEL',
    ];

    try {
        conn = await postgre.connect();

        for (let i = 0; i < peti_type.length; i++) {
            const sql = `
            INSERT INTO type_chemistry
            (peti_type, compatible_type, incompatible_type)
            VALUES ($1, $2, $3)`;
            const value = [peti_type[i], compatible_type[i], incompatible_type[i]];
            await postgre.query(sql, value);
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
module.exports = petiChemistryRouter;
