require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const accountRouter = require('./routes/account');
app.use('/account', accountRouter);

app.listen(port, () => {
    console.log(`${port}번에서 http 웹서버 실행`);
});
