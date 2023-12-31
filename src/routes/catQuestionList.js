const catQuestionListRouter = require('express').Router();
const { postgre } = require('../config/database/postgre');

catQuestionListRouter.post('/', async (req, res) => {
    let conn = null;

    const catQuestion = [
        '활동적인 놀이를 그다지 좋아하지 않는다.',
        '갑작스럽게 집 안을 뛰어다니며 에너지를 발산한다.',
        '새로운 장난감이나 물건이 있어도 별로 관심을 가지지 않는다.',
        '움직이는 물체를 발견하면 흥분한다.',
        '높은 곳으로 뛰어 오르거나 좁은 공간을 기어다니는 것을 좋아한다.',
        '사료를 몇 번이고 주는대로 먹는다.',
        '식사 시간이 되면 울면서 나를 졸졸 따라다닌다.',
        '숨겨 놓은 사료나 간식을 찾아서 먹는다.',
        '새로운 음식을 발견하면 냄새만 맡는다.',
        '특정 음식에 대한 강한 선호나 거부감을 보인다.',
        '낯선 사람을 봤을 때 숨거나 멀리서 관찰한다.',
        '가족 구성원들과 자주 싸운다.',
        '창 밖에 다른 동물 봐도 쫄지 않고 바로 채터링한다.',
        '현관에서 소리가 들리면 문 앞으로 달려나간다.',
        '멀리 떨어졌을 때 이름을 불러도 오지 않는다.',
        '나에게 자주 박치기나 부비부비를 한다.',
        '내가 무언가를 할 때 곁에서 조용히 지켜본다.',
        '잘 때 내 옆에 폴짝 올라와서 기대고 자리 잡고 골골송 노래를 부른다.',
        '내 앞에서 배를 쉽사리 보여주지 않는다.',
        '내가 집에 들어와도 들어온지도 모른다.',
    ];

    const left_option = [
        '집사야 장난감을 들어라옹',
        '가만히 있고 싶다 집사야!',
        '새로운 장난감이냐옹?',
        '집사 알아서 해라옹..',
        '가만히 쉬고 싶다옹..',
        '하루 적정량에 맞게 주라옹!',
        '이따가 먹을게 한타 중이야!',
        '시간되면 알아서 주겠지..',
        '이건 새로나온 츄르냐옹?',
        '먹을껀 다 좋다옹',
        '누구냐용? 나의 새로운 집사..?',
        '우리는 모두 가족이댜옹!',
        '집 밖은 위험해!',
        '낯선 소리는 무섭다옹..',
        '집사야 무슨일이냥옹??',
        '집사는 집사일 뿐이다옹',
        '집사에게 관심없다옹!',
        '나는 혼자잘꺼다옹',
        '집사님 나의 배를 만져달라옹!',
        '집사야!! 기다렸어! 보고싶었어!',
    ];

    const right_option = [
        '집사야.. 나는 그냥 혼자 있고 싶다옹..',
        '집사야 나 술래잡기 놀이 하고싶어!',
        '장난감은 질렸다옹...',
        '??? 저거 뭐야??? 저거 뭐냐고!!!',
        '집사야 나의 꿈은 탐험가다옹!',
        '엄마 나는 엄마만 보면 배가 고파요! 밥 주세냐용!',
        '집사님 밥 시간이에요! 밥 주세요!',
        '여기에 숨겨 놓은거 다 안다옹!',
        '뭐지?? 집사 발냄새냐옹???',
        '내가 먹고 싶은 것만 먹을꺼다옹',
        '누구야.. 당신 뭐냐옹??',
        '내 구역에 침범하지 말라옹!',
        '세상은 넓고 할 일은 많구나!',
        '누구지?? 집사냐옹??',
        '집사야 한타 중이다옹!',
        '집사는 나의 전부 I’m 신뢰댜옹♥',
        '집사 뭐해? 옆에서 지켜볼꺼다옹!',
        '헿 집사 손길이 제일 좋댜옹♥',
        '내 배는 나만 볼 수 있다냥',
        '우리 집사 왔구나.. 그렇구나.. 알겠다옹',
    ];

    // 가중치 생성 함수
    function makeWeight(idx) {
        return Array.from({ length: 5 }, (_, i) => {
            if ((idx + 1) % 5 === 1 && i === 0) return 4;
            else if ((idx + 1) % 5 === 0 && i === 4) return 1;
            else if ((idx + 1) % 5 === i + 1) return 1;
        });
    }

    // 질문 유형 결정 함수
    function determineQuestionType(idx) {
        if (idx > 20 && idx < 26) return '활동성';
        else if (idx > 25 && idx < 31) return '식탐성';
        else if (idx > 30 && idx < 36) return '사교성';
        else return '애교성';
    }

    try {
        conn = await postgre.connect();

        for (let i = 0; i < catQuestion.length; i++) {
            const weight = makeWeight(i);
            const questionType = determineQuestionType(i);
            const sql = `
            INSERT INTO peti_question 
            (cat_question, left_option, right_option, first_weight, second_weight, third_weight, fourth_weight, fifth_weight, question_type) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
            const value = [catQuestion[i], left_option[i], right_option[i], ...weight, questionType];
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

module.exports = catQuestionListRouter;
