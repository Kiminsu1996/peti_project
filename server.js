require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const port = process.env.PORT;
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

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
