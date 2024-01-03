function calculateWeightedPercentage(responses, questionType) {
    let maximumScore = 0;
    let minimumScore = 0;
    let totalUserScore = 0;

    // 응답과 가중치를 곱한 값과 가중치의 합을 계산
    responses.forEach((item) => {
        maximumScore += item.weight * 3;
        minimumScore += item.weight * -3;
        totalUserScore += item.response * item.weight;
    });

    // 가중치가 적용된 평균을 퍼센트로 계산
    const percentage = (((totalUserScore - minimumScore) / (maximumScore - minimumScore)) * 100).toFixed(0);
    // if(percentage == 50) {대표질문의 선택에 따라 양수로 선택하면 }
    return { percentage, questionType };
}

module.exports = calculateWeightedPercentage;

//프론트에서 값을 이렇게 줄 때?
// [
//     [
//     { "idx": 2, "response": -2, "weight": 1, "question_type" : "활동성" },
//     { "idx": 4, "response": 1, "weight": 1, "question_type" : "활동성" },
//     { "idx": 5, "response": 0, "weight": 1, "question_type" : "활동성" },
//     { "idx": 1, "response": 3, "weight": 4, "question_type" : "활동성" },
//     { "idx": 3, "response": -1, "weight": 1, "question_type" : "활동성" }
//     ],
//     [
//     { "idx": 2, "response": -2, "weight": 1, "question_type" : "식탐성" },
//     { "idx": 4, "response": 1, "weight": 1, "question_type" : "식탐성" },
//     { "idx": 5, "response": 0, "weight": 1, "question_type" : "식탐성" },
//     { "idx": 1, "response": 3, "weight": 4, "question_type" : "식탐성" },
//     { "idx": 3, "response": -1, "weight": 1, "question_type" : "식탐성" }
//     ],
//     [
//     { "idx": 2, "response": -2, "weight": 1, "question_type" : "사교성" },
//     { "idx": 4, "response": 1, "weight": 1, "question_type" : "사교성" },
//     { "idx": 5, "response": 0, "weight": 1, "question_type" : "사교성" },
//     { "idx": 1, "response": 3, "weight": 4, "question_type" : "사교성" },
//     { "idx": 3, "response": -1, "weight": 1, "question_type" : "사교성" }
//     ],
//     [
//     { "idx": 2, "response": -2, "weight": 1, "question_type" : "애교성" },
//     { "idx": 4, "response": 1, "weight": 1, "question_type" : "애교성" },
//     { "idx": 5, "response": 0, "weight": 1, "question_type" : "애교성" },
//     { "idx": 1, "response": 3, "weight": 4, "question_type" : "애교성" },
//     { "idx": 3, "response": -1, "weight": 1, "question_type" : "애교성" }
//     ]
// ]
