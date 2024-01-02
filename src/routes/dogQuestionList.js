const dogQuestionListRouter = require('express').Router();
const { postgre } = require('../config/database/postgre');

dogQuestionListRouter.post('/', async (req, res) => {
    let conn = null;

    const dogQuestion = [
        '산책이라는 말을 들으면 흥분해서 달려온다.',
        '장시간의 활동 후에도 에너지가 넘친다.',
        '놀이 시간보다 휴식 시간을 더 선호한다.',
        '새로운 장소에 가면 흥분해서 주변을 돌아다닌다.',
        '움직이는 시간보다 누워 있는 시간이 더 많다.',
        '사료를 몇 번이고 주는대로 먹는다.',
        '길가에 떨어진 음식도 일단 먹는다.',
        '간식은 일단 숨기고 본다.',
        '내가 음식을 먹을 때 쳐다도 보지 않는다.',
        '특정 음식에 대한 강한 선호나 거부감을 보인다.',
        '처음 보는 강아지나 사람을 만나면 숨기 바쁘다.',
        '다른 강아지와 장난감을 공유한다.',
        '다른 사람이 이뻐하면 주인도 버리고 가버린다.',
        '다른 강아지를 마주치면 짖으며 흥분한다.',
        '다른 강아지와 놀고 있을 때 이름을 불러도 쳐다도 안본다.',
        '만져달라고 발라당 배를 깐다.',
        '내가 집 밖을 나가도 관심이 없다.',
        '내가 집에 들어오면 꼬리가 헬리콥터가 된다.',
        '내 옆에서 자는 것을 가장 좋아한다.',
        '장난감이나 물건을 나에게 가져다 준다.',
    ];

    const left_option = [
        '산..뭐라고? 귀찮아..오늘은 집에 있자? 응?',
        'ㄱ..그..만..이제 좀 쉬자ㅠㅠ',
        '나는 에너자이개야! 백만스물하나 백만스물둘!',
        '여..여긴 어디야..? 나 좀 안아줘..',
        '이것도 해야 하고 저것도 해야 하고 바쁘다 바빠!!',
        '지금 밥 시간 아닌데? 내 배 좀 봐 아직도 남산만 해ㅠㅠ',
        '킁킁 이게 뭐지.. 먹을 건 아닌 것 같고.. ',
        '내 사전에 숨김은 없다! 바로바로 먹어야지~ ',
        '그건 무슨 음식이야? 맛있겠다! 새로운거 또 먹어볼래!',
        '윽 맛 없어!! 내 취향을 아직도 몰라??',
        '안녕! 너는 누구야?',
        '네 것은 네 것이고, 내 것은 내 것이야',
        '엄마 모르는 사람이 나 만져!',
        '안녕하세요! 악수나 한번?',
        '엄마 모르는 강아지가 나 만져!',
        '앗! 엄마 내 뱃살은 소중해…',
        '엄마ㅠㅠ 어디가..흑흑흑',
        '잠깐만 엄마 한타 중이야',
        '나는 내 침대가 더 좋아!',
        '내 물건은 내꺼야!',
    ];

    const right_option = [
        '산책?? 빨리 나가자! 어서 나가서 놀고 싶어!',
        '나는 아직 지치지 않았어! 다시 일어나보시개!!',
        '나랑 같이 쉬면서 강형욱 아저씨 유튜브 보자..',
        '미지의 세계네?? 빨리 탐험해보고 싶어!',
        '난 모든게 귀찮아… 누워있을래.. 귀찮다멍….',
        '가만히 있기만 해도 배가 고파!! 밥 주개 밥!!',
        '헉 이것도 먹는건가? 저것도?? 입에 닿는대로 다 먹어버려야지 !!',
        '여기 숨기면 아무도 모르겠지? 나중에 먹어야겠당',
        '킁킁 무슨 음식 냄새가 나는 것 같긴 한데.. 관심 없어..',
        '난 입에 들어갈 수 있으면 다 먹는다멍',
        '흐어엉… 뭐야.. 너무 무서워…. 엄마아아아앙',
        '네 것도 내 것이고, 내 것도 내 것이야!',
        '안녕 엄마 나는 갈개!',
        '야! 야! 이씨! 너! 누구야! 일루와봐! 깨갱',
        '??? 아니 엄마 잠깐만 오늘 외박 좀 할게',
        '엄마 내 배 좀 봐라?? 탐스럽지?? 삼겹살이야!',
        '어? 엄마 나갔구나~ 돈 벌어와',
        '옴마다 옴마!! 엄마 기다렸다규ㅠㅠㅠㅠ!!!!',
        '엄마 옆이면 꿀잠이야. 여기가 내 안식처라구 ~_~',
        '엄마 내 보물인데 엄마 주는거야!!',
    ];

    // 가중치 생성 함수
    function makeWeight(idx) {
        return Array.from({ length: 1 }, (_, i) => {
            if ((idx + 1) % 5 === 1 && i === 0) return 4;
            else if ((idx + 1) % 5 === 0 && i === 4) return 1;
            else if ((idx + 1) % 5 === i + 1) return 1;
        });
    }

    // 질문 유형 결정 함수
    function determineQuestionType(idx) {
        if (idx < 5) return '활동성';
        else if (idx < 10) return '식탐성';
        else if (idx < 15) return '사교성';
        else return '애교성';
    }

    try {
        conn = await postgre.connect();

        for (let i = 0; i < dogQuestion.length; i++) {
            const weight = makeWeight(i);
            const questionType = determineQuestionType(i);
            const sql = `
            INSERT INTO peti_question 
            (dog_question, left_option, right_option, weight, question_type) 
            VALUES ($1, $2, $3, $4, $5)`;
            const value = [dogQuestion[i], left_option[i], right_option[i], ...weight, questionType];
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

module.exports = dogQuestionListRouter;
