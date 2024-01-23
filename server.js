require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const port = process.env.PORT;
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.static('public'));

const chatRouter = require('./src/routes/chat');
app.use('/chat', chatRouter);

const categoryRouter = require('./src/routes/category');
app.use('/category', categoryRouter);

const assessmentRouter = require('./src/routes/assessment');
app.use('/peti', assessmentRouter);

// seeding
const questionListRouter = require('./src/routes/questionList');
app.use('/questionList', questionListRouter);

const petiDescriptionRouter = require('./src/routes/petiDescriptionList');
app.use('/petiDescriptionList', petiDescriptionRouter);

const typeListRouter = require('./src/routes/typeList');
app.use('/typeList', typeListRouter);

const { HttpException } = require('./src/exception/exception');

//클라이언트가 서버에 연결이 되면 실행
io.on('connection', (socket) => {
    //채팅방 입장
    socket.on('connection', (petiType) => {
        socket.join(petiType);
        console.log(`${petiType} 방에 오신걸 환영 합니다.`);
    });

    socket.on('disconnect', () => {
        console.log('연결이 끊겼습니다.');
    });
});

app.use((error, req, res, next) => {
    //req에서 json 형태가 아닐 경우
    if (error instanceof SyntaxError) {
        return res.status(400).send({
            message: 'invalid json',
        });
    }

    if (error instanceof HttpException) {
        return res.status(error.status).send({
            message: error.message,
        });
    }

    console.log(error);
});

server.listen(port, () => {
    console.log(`${port}번에서 http 웹서버 실행`);
});

//500은 서버에서 애러발생
//404 Not Found (페이지를 찾을 수 없음)
//400 클라이언트에서 받은 요청이 이상할 때 예)잘못된 데이터를 줄때
