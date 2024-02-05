const { BadRequestException } = require('../config/exception');

const questionGetValidation = (req, res, next) => {
    const { type } = req.query;

    if (!['dog', 'cat'].includes(type)) {
        throw new BadRequestException('Wrong information');
    }
    next();
};

const chatPostValidation = (req, res, next) => {
    const { uuid, petiType, message } = req.body;

    if (!uuid || typeof uuid !== 'string' || uuid.trim().length !== 10) {
        throw new BadRequestException('Wrong information');
    }
    if (!petiType || typeof petiType !== 'string' || petiType.trim().length !== 4) {
        throw new BadRequestException('Wrong information');
    }
    if (!message || typeof message !== 'string' || message.trim().length > 100) {
        throw new BadRequestException('Wrong information');
    }

    next();
};

const chatGetValidation = (req, res, next) => {
    const { lastIdx } = req.query;
    const { petiType } = req.params;

    if (lastIdx !== undefined && isNaN(lastIdx.trim())) {
        throw new BadRequestException('Wrong information');
    }

    if (!petiType || typeof petiType !== 'string' || petiType.trim().length !== 4) {
        throw new BadRequestException('Wrong information');
    }

    next();
};

const resultPostValidation = (req, res, next) => {
    let { qusetionAnswerlist, petName, petType } = req.body;
    const nameRegex = /^[가-힣a-zA-Z0-9]{1,10}$/; // 한글,영어(소문자,대문자), 숫자 최대 길이 10 까지
    const idxSet = new Set(); //자료구조 set 안에 값은 중복된 값이 없어야한다.

    if (typeof qusetionAnswerlist === 'string') {
        try {
            qusetionAnswerlist = JSON.parse(qusetionAnswerlist);
        } catch (error) {
            throw new BadRequestException('Invalid qusetionAnswerlist format');
        }
    }

    if (!qusetionAnswerlist || !Array.isArray(qusetionAnswerlist) || qusetionAnswerlist.length !== 20) {
        throw new BadRequestException('Wrong information');
    }

    // for(let 변수 of 배열) 변수는 배열의 각 요소를 차례대로 가리키는 변수이며, 배열은 순회할 배열
    for (let result of qusetionAnswerlist) {
        //hasOwnProperty 메소드는 객체가 특정 속성을 가지고 있는지 여부를 확인
        if (!result || typeof result !== 'object' || !result.hasOwnProperty('idx') || !result.hasOwnProperty('response')) {
            throw new BadRequestException('Wrong information');
        }
        //.has(value) :특정 값을 포함하고 있는지 확인한다. (있으면 true 없으면 false 반환) / idx의 중복 값 체크
        if (idxSet.has(result.idx)) {
            throw new BadRequestException('Duplicate idx');
        }
        //.add(value): Set에 값을 추가 / 중복된 값이 없을 때 반환
        idxSet.add(result.idx);

        if (typeof result.idx !== 'number' || ![1, 2, 3, -1, -2, -3].includes(result.response)) {
            throw new BadRequestException('Wrong information');
        }
    }

    if (!petName || typeof petName !== 'string' || !nameRegex.test(petName)) {
        throw new BadRequestException('Wrong information');
    }

    if (!petType || typeof petType !== 'string' || petType.trim().length === 0) {
        throw new BadRequestException('Wrong information');
    }
    next();
};

const resultGetValidation = (req, res, next) => {
    const { uuid } = req.params;

    if (!uuid || typeof uuid !== 'string' || uuid.trim().length !== 10) {
        throw new BadRequestException('Wrong information');
    }
    next();
};

module.exports = { questionGetValidation, chatPostValidation, chatGetValidation, resultPostValidation, resultGetValidation };
