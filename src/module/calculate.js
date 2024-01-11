/**
 * @param {number[]} numberList
 * @returns {number}
 */
const sumAbs = (numberList) => {
    let sum = 0;

    for (const number of numberList) {
        sum += Math.abs(number);
    }

    return sum;
};

module.exports = {
    sumAbs,
};
