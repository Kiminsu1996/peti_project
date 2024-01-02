const questionModel = require('./selectQuestion');

async function handleQuestionRequest(type, page, itemsPerPage) {
    try {
        const questions = await questionModel.getQuestions(type, page, itemsPerPage);
        return questions;
    } catch (error) {
        throw error;
    }
}

module.exports = handleQuestionRequest;
