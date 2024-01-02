const calculateWeightPercentage = require('./weightPercentage');
const typeElement = require('./typeElementCalculate');

const calculateResults = (arrayResponses) => {
    let results = [];
    let petiType = '';
    let proportions = {
        aProportion: null,
        eProportion: null,
        cProportion: null,
        lProportion: null,
    };

    arrayResponses.forEach((responses) => {
        const questionType = responses[0].question_type;
        const weightPercentage = calculateWeightPercentage(responses, questionType);
        weightPercentage.typeElementResult = typeElement(weightPercentage.percentage, questionType);
        results.push({ weightPercentage });

        ({ percentage } = weightPercentage);
        petiType += weightPercentage.typeElementResult;

        if (questionType === '활동성') proportions.aProportion = percentage;
        if (questionType === '식탐성') proportions.eProportion = percentage;
        if (questionType === '사교성') proportions.cProportion = percentage;
        if (questionType === '애교성') proportions.lProportion = percentage;
    });

    return { results, petiType, ...proportions };
};

module.exports = calculateResults;
