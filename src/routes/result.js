const resultRouter = require('express').Router();
const { postgre } = require('../config/database/postgre');
const calculateResult = require('../models/typeCalculations');
const { selectTypeDescription } = require('../models/selectTypeDescription');
const { selectTypeChemistry } = require('../models/selectTypeChemistry');
const updatePetiResult = require('../models/updatePetiResult');

resultRouter.post('/', async (req, res, next) => {
    const { arrayResponses, pet_name, pet_type, pet_img } = req.body;
    let conn = null;
    let calculationResults = null;
    const result = {
        success: false,
        message: null,
    };

    try {
        if (!arrayResponses || !pet_name || !pet_type) {
            result.message = 'Please enter the data';
            return res.status(400).send(result);
        }

        conn = await postgre.connect();

        //팻정보 저장
        const sql = 'INSERT INTO peti_result (id, pet_name, pet_type, pet_img) VALUES ($1, $2, $3, $4)';
        const data = [id, pet_name, pet_type, pet_img || null];
        await postgre.query(sql, data);

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

resultRouter.get('/user', async (req, res, next) => {});

//위 post api는 계산에 대한 부분을 수정해야한다..... 제대로 수정하자 하나하나 차근차근 수정해보자.. 내가 봤을 때 계산 부분을 좀 합칠 필요가 있다.

module.exports = resultRouter;
