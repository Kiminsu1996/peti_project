const petiDescriptionRouter = require('express').Router();
const { pgPool } = require('../config/database/postgre');

petiDescriptionRouter.post('/', async (req, res) => {
    const peti_eng_name = [
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

    const peti_kor_name = [
        '아벨',
        '아벡',
        '아빌',
        '아빅',
        '아셀',
        '아섹',
        '아실',
        '아식',
        '하벨',
        '하벡',
        '하빌',
        '하빅',
        '하셀',
        '하섹',
        '하실',
        '하식',
    ];

    const summary = [
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

    const description = [
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

    const compatible = [
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

    const incompatible = [
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
        for (let i = 0; i < peti_eng_name.length; i++) {
            const sql = `
            INSERT INTO 
                peti
                    (peti_eng_name, peti_kor_name, compatible, incompatible, summary, description)
            VALUES 
                ($1, $2, $3, $4, $5, $6)`;
            const value = [peti_eng_name[i], peti_kor_name[i], compatible[i], incompatible[i], summary[i], description[i]];
            await pgPool.query(sql, value);
        }

        res.send('성공');
    } catch (error) {
        return next(error);
    }
});
module.exports = petiDescriptionRouter;
