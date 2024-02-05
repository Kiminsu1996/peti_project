require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const port = process.env.PORT;
const server = http.createServer(app);
const io = socketIo(server);
const { saveChatMessage } = require('./src/module/chatPost');
const { logging } = require('./src/module/logging');
const { HttpException } = require('./src/config/exception');
const controller = require('./src/module/controller');

app.use(logging);
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

//api
const chatRouter = require('./src/routes/chat');
app.use('/chat', chatRouter);

const categoryRouter = require('./src/routes/category');
app.use('/category', categoryRouter);

const assessmentRouter = require('./src/routes/assessment');
app.use('/peti', assessmentRouter);

// seeding
const questionListRouter = require('./test/questionList');
app.use('/questionList', questionListRouter);

const petiDescriptionRouter = require('./test/petiDescriptionList');
app.use('/petiDescriptionList', petiDescriptionRouter);

const typeListRouter = require('./test/typeList');
app.use('/typeList', typeListRouter);

//클라이언트가 서버에 연결이 되면 실행
const chatRoomMembers = new Map();

io.on('connection', (socket) => {
    let roomTimeout;

    //채팅방 입장
    socket.on('joinRoom', (petiType) => {
        const members = chatRoomMembers.get(petiType) || 0;

        //채팅방 인원수 조절 최대 20명
        if (members < 20) {
            socket.join(petiType);
            chatRoomMembers.set(petiType, members + 1);
            console.log(`${petiType} 방에 오신걸 환영 합니다.`);

            // 1시간 이상 채팅망에 머무를 경우 자동으로 나가는 설정
            roomTimeout = setTimeout(() => {
                socket.leave(petiType);
                const members = chatRoomMembers.get(petiType) || 0;
                chatRoomMembers.set(petiType, Math.max(0, members - 1));
                socket.emit('autoLeaveRoom', `${petiType} 방에서 자동으로 나갑니다.`);
            }, 3600000);
        } else {
            socket.emit('roomFull', '채팅방 인원수가 가득 찼습니다.');
        }
    });

    // 채팅방 메세지 보내기
    socket.on(
        'chatMessage',
        controller(async (msg, uuid, petiType) => {
            //메세지 저장
            await saveChatMessage(msg, uuid, petiType);
            io.to(petiType).emit('newChatMessage', msg);
        })
    );

    // 채팅방 나가게 되면 인원수 감소
    socket.on('leaveRoom', (petiType) => {
        socket.leave(petiType);
        clearTimeout(roomTimeout); // 타이머 해제
        const members = chatRoomMembers.get(petiType) || 0;
        chatRoomMembers.set(petiType, Math.max(0, members - 1));
        socket.emit('leftRoom', `${petiType} 방에서 나갔습니다.`);
    });

    //채팅방 나가기
    socket.on('disconnect', () => {
        clearTimeout(roomTimeout);
        console.log('연결이 끊겼습니다.');
    });
});

//애러처리
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
