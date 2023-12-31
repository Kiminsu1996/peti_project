const petiDescriptionRouter = require('express').Router();
const { postgre } = require('../config/database/postgre');

petiDescriptionRouter.post('/', async (req, res) => {
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

    const peti_propensity = [
        '애교 많고 밖을 좋아하는 인싸인 대식가',
        '시크 하고 밖을 좋아하는 인싸인 대식가',
        '애교 많고 밖을 좋아하는 아싸인 대식가',
        '시크 하고 밖을 좋아하는 아싸인 대식가',
        '애교 많고 밖을 좋아하는 인싸인 소식가',
        '시크 하고 밖을 좋아하는 인싸인 소식가',
        '애교 많고 밖을 좋아하는 아싸인 소식가',
        '시크 하고 밖을 좋아하는 아싸인 소식가',
        '애교 많고 집을 좋아하는 인싸인 대식가',
        '시크 하고 집을 좋아하는 인싸인 대식가',
        '애교 많고 집을 좋아하는 아싸인 대식가',
        '시크 하고 집을 좋아하는 아싸인 대식가',
        '애교 많고 집을 좋아하는 인싸인 소식가',
        '시크 하고 집을 좋아하는 인싸인 소식가',
        '애교 많고 집을 좋아하는 아싸인 소식가',
        '시크 하고 집을 좋아하는 아싸인 소식가',
    ];

    const peti_description = [
        '밖에서 즐거운 시간을 보내는 대식가로, 친구들 사이에서 인싸인! 나에겐 사랑스러운 애교쟁이 입니다.',
        '밖에서 즐거운 시간을 보내는 대식가로, 친구들 사이에서 인싸인! 나에겐 조금 시크한 매력을 보여줍니다.',
        '밖에서 즐거운 시간을 보내는 대식가로, 다른 이들과 거리가 적당한 거리를 유지하지만, 나에겐 사랑스러운 애교쟁이 입니다.',
        '밖에서 즐거운 시간을 보내는 대식가로, 다른 이들과 거리가 적당한 거리를 유지하지만, 그 시크함이 바로 매력입니다.',
        '밖에서 즐거운 시간을 보내는 소식가로, 친구들 사이에서 인싸인! 나에겐 사랑스러운 애교쟁이 입니다.',
        '밖에서 즐거운 시간을 보내는 소식가로, 친구들 사이에서 인싸인! 나에겐 조금 시크한 매력을 보여줍니다.',
        '밖에서 즐거운 시간을 보내는 소식가로, 다른 이들과 거리가 적당한 거리를 유지하지만, 나에겐 사랑스러운 애교쟁이 입니다.',
        '밖에서 즐거운 시간을 보내는 소식가로, 다른 이들과 거리가 적당한 거리를 유지하지만, 그 시크함이 바로 매력입니다.',
        '집에서 즐거운 시간을 보내는 대식가로, 친구들 사이에서 인싸인! 나에겐 사랑스러운 애교쟁이 입니다.',
        '집에서 즐거운 시간을 보내는 대식가로, 친구들 사이에서 인싸인! 나에겐 조금 시크한 매력을 보여줍니다.',
        '집에서 즐거운 시간을 보내는 대식가로, 다른 이들과 거리가 적당한 거리를 유지하지만, 나에겐 사랑스러운 애교쟁이 입니다.',
        '집에서 즐거운 시간을 보내는 대식가로, 다른 이들과 거리가 적당한 거리를 유지하지만, 그 시크함이 바로 매력입니다.',
        '집에서 즐거운 시간을 보내는 소식가로, 친구들 사이에서 인싸인! 나에겐 사랑스러운 애교쟁이 입니다.',
        '집에서 즐거운 시간을 보내는 소식가로, 친구들 사이에서 인싸인! 나에겐 조금 시크한 매력을 보여줍니다.',
        '집에서 즐거운 시간을 보내는 소식가로, 다른 이들과 거리가 적당한 거리를 유지하지만, 나에겐 사랑스러운 애교쟁이 입니다.',
        '집에서 즐거운 시간을 보내는 소식가로, 다른 이들과 거리가 적당한 거리를 유지하지만, 그 시크함이 바로 매력입니다.',
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
            INSERT INTO type_description
            (peti_type, peti_propensity, peti_description, compatible_type, incompatible_type)
            VALUES ($1, $2, $3, $4, $5)`;
            const value = [peti_type[i], peti_propensity[i], peti_description[i], compatible_type[i], incompatible_type[i]];
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
module.exports = petiDescriptionRouter;
