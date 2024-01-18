const returnAlphbet = (resultList, sortedResponses) => {
    let proportions = {
        aProportion: null,
        eProportion: null,
        cProportion: null,
        lProportion: null,
    };

    resultList.forEach((value, index) => {
        switch (index) {
            case 0:
                if (value > 50) {
                    proportions.aProportion = 'A';
                } else if (value < 50) {
                    proportions.aProportion = 'H';
                } else {
                    proportions.aProportion = sortedResponses[0].response > 0 ? 'A' : 'H';
                }
                break;
            case 1:
                if (value > 50) {
                    proportions.eProportion = 'B';
                } else if (value < 50) {
                    proportions.eProportion = 'S';
                } else {
                    proportions.eProportion = sortedResponses[5].response > 0 ? 'B' : 'S';
                }
                break;
            case 2:
                if (value > 50) {
                    proportions.cProportion = 'E';
                } else if (value < 50) {
                    proportions.cProportion = 'I';
                } else {
                    proportions.cProportion = sortedResponses[10].response > 0 ? 'E' : 'I';
                }
                break;
            case 3:
                if (value > 50) {
                    proportions.lProportion = 'L';
                } else if (value < 50) {
                    proportions.lProportion = 'C';
                } else {
                    proportions.lProportion = sortedResponses[15].response > 0 ? 'L' : 'C';
                }
                break;
            default:
                break;
        }
    });

    return proportions;
};

module.exports = { returnAlphbet };
