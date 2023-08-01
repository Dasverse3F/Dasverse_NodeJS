const express = require('express'); //한줄한줄 주석달면서 공부하자 이해안하는거 전부뤼튼 처음부터 그림을 그려보자
const cors = require('cors');
const userRouter = require('./routes/user_route');
const sequelize = require('./custom_modules/database');
const app = express();

// Express
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// 라우트
app.use('/user', userRouter);

// 서버 시작
app.listen(3000, () => {
    console.log('Server started at http://localhost:3000');
});
