function typeElement(weightPercentage, questionType) {
    const percentage = parseInt(weightPercentage);
    if (questionType === '활동성') return percentage > 50 ? 'A' : 'H';
    if (questionType === '식탐성') return percentage > 50 ? 'B' : 'S';
    if (questionType === '사교성') return percentage > 50 ? 'E' : 'I';
    if (questionType === '애교성') return percentage > 50 ? 'L' : 'C';
    return null;
}

module.exports = typeElement;
