require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const port = process.env.PORT;
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

const questionRouter = require('./src/routes/question');
app.use('/question', questionRouter);

const resultRouter = require('./src/routes/result');
app.use('/result', resultRouter);

const chatRouter = require('./src/routes/chat');
app.use('/chat', chatRouter);

const questionListRouter = require('./src/routes/questionList');
app.use('/questionList', questionListRouter);

const petiDescriptionRouter = require('./src/routes/petiDescriptionList');
app.use('/petiDescriptionList', petiDescriptionRouter);

const { HttpException } = require('./src/module/Exception');

//클라이언트가 서버에 연결이 되면 실행
io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('joinRoom', (room) => {
        socket.join(room); // 사용자를 방에 참여
        console.log(`user join: ${room}`);
    });

    socket.on('message', (data) => {
        // 메시지를 해당 방의 모든 사용자에게 전송
        io.to(data.room).emit('message', { sender: data.sender, message: data.message });
    });

    //사용자가 서버와 연결을 끊을 때
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.use((error, req, res, next) => {
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

    res.status(500).send({
        message: 'Unexpected Error Occured',
    });
});

server.listen(port, () => {
    console.log(`${port}번에서 http 웹서버 실행`);
});

//500은 서버에서 애러발생
//404 Not Found (페이지를 찾을 수 없음)
//400 클라이언트에서 받은 요청이 이상할 때 예)잘못된 데이터를 줄때
// 400
// 401
// 403
// 404
// 409
// 500
