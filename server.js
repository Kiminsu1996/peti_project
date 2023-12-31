require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const accountRouter = require('./routes/account');
app.use('/account', accountRouter);

const questionRouter = require('./routes/question');
app.use('/question', questionRouter);

const resultRouter = require('./routes/result');
app.use('/result', resultRouter);

const dogQuestionListRouter = require('./routes/dogQuestionList');
app.use('/dogQuestionList', dogQuestionListRouter);

const catQuestionListRouter = require('./routes/catQuestionList');
app.use('/catQuestionList', catQuestionListRouter);

app.listen(port, () => {
    console.log(`${port}번에서 http 웹서버 실행`);
});
