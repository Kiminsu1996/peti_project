const resultRouter = require('express').Router();
const { postgre } = require('../config/database/postgre');
const calculateResult = require('../models/typeCalculations');
const { selectTypeDescription } = require('../models/selectTypeDescription');
const { selectTypeChemistry } = require('../models/selectTypeChemistry');
const updatePetiResult = require('../models/updatePetiResult');

resultRouter.post('/', async (req, res, next) => {
    const { arrayResponses, id } = req.body;
    let conn = null;
    let calculationResults = null;
    const result = {
        success: false,
        message: null,
    };

    try {
        if (!id || !arrayResponses) {
            result.message = 'Please enter the data';
            return res.status(400).send(result);
        }

        conn = await postgre.connect();

        //id 존재 여부 확인
        const checkIdSql = `SELECT EXISTS(SELECT 1 FROM peti_result WHERE id = $1)`;
        const idExists = await conn.query(checkIdSql, [id]);

        if (!idExists.rows[0].exists) {
            result.message = 'This is an unregistered ID';
            return res.status(400).send(result);
        }

        calculationResults = calculateResult(arrayResponses);
        const { petiType, aProportion, eProportion, cProportion, lProportion } = calculationResults;
        const { peti_propensity, peti_description } = await selectTypeDescription(petiType);
        const { compatible_type, incompatible_type } = await selectTypeChemistry(petiType);

        // await updatePetiResult(
        //     id,
        //     petiType,
        //     aProportion,
        //     eProportion,
        //     cProportion,
        //     lProportion,
        //     peti_propensity,
        //     peti_description,
        //     compatible_type,
        //     incompatible_type
        // );
        result.success = true;
        res.status(200).send(result);
    } catch (error) {
        return next(error);
    } finally {
        if (conn) {
            conn.end();
        }
    }
});

module.exports = resultRouter;
