const calculateResult = (userValue, queryValue) => {
    const respons = userValue.sort((start, end) => start.idx - end.idx).map((value) => value.response);
    const query = queryValue.rows.map((weight) => weight.weight / 10);

    // 사용자 점수 가져오기
    const uservalue = respons.reduce((sum, element, idx) => {
        const userScore = Math.floor(idx / 5);
        sum[userScore] = sum[userScore] || [];
        sum[userScore].push(element * query[idx]);
        return sum;
    }, []);

    // 가중치 가져오기
    const weightValue = query.reduce((sum, element, idx) => {
        const weight = Math.floor(idx / 5);
        sum[weight] = sum[weight] || [];
        sum[weight].push(element);
        return sum;
    }, []);

    // 사용자의 총합 계산
    const sums = uservalue.map((values) => values.reduce((sum, value) => sum + value, 0));

    //최대 가능 점수 계산
    const maxWeight = weightValue.map((value) => value.reduce((sum, num) => sum + Math.abs(num) * 3, 0));
    //최소 가능 점수 계산
    const minWeight = weightValue.map((value) => value.reduce((sum, num) => sum + Math.abs(num) * -3, 0));

    //가중치 퍼센트 계산
    const weightPercent = sums.map((userScore, index) => {
        const maxScore = maxWeight[index];
        const minScore = minWeight[index];

        return parseInt(((userScore - minScore) / (maxScore - minScore)) * 100);
    });

    return weightPercent;
};

module.exports = calculateResult;
