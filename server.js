require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const port = process.env.PORT;
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

const accountRouter = require('./src/routes/account');
app.use('/account', accountRouter);

const questionRouter = require('./src/routes/question');
app.use('/question', questionRouter);

const resultRouter = require('./src/routes/result');
app.use('/result', resultRouter);

const chatRouter = require('./src/routes/chat');
app.use('/chat', chatRouter);

const dogQuestionListRouter = require('./src/routes/dogQuestionList');
app.use('/dogQuestionList', dogQuestionListRouter);

const catQuestionListRouter = require('./src/routes/catQuestionList');
app.use('/catQuestionList', catQuestionListRouter);

const petiDescriptionRouter = require('./src/routes/petiDescriptionList');
app.use('/petiDescriptionList', petiDescriptionRouter);

const petiChemistryRouter = require('./src/routes/petiChemistryList');
app.use('/petiChemistryList', petiChemistryRouter);

//클라이언트가 서버에 연결이 되면 실행
io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('joinRoom', (room) => {
        socket.join(room); // 사용자를 방에 참여시킵니다.
        console.log(`user join: ${room}`);
    });

    socket.on('sendMessage', (data) => {
        // 메시지를 해당 방의 모든 사용자에게 전송합니다.
        io.to(data.room).emit('message', { sender: data.sender, message: data.message });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.use((error, req, res, next) => {
    console.log(error);
    const statusCode = error.status || 500;
    res.status(statusCode).json({
        success: false,
        message: error.message,
    });
});

server.listen(port, () => {
    console.log(`${port}번에서 http 웹서버 실행`);
});

//500은 서버에서 애러발생
//404 Not Found (페이지를 찾을 수 없음)
//400 클라이언트에서 받은 요청이 이상할 때 예)잘못된 데이터를 줄때
