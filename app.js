const express = require('express'); //한줄한줄 주석달면서 공부하자 이해안하는거 전부뤼튼 처음부터 그림을 그려보자
const cors = require('cors');
const { Sequelize } = require('sequelize');
const userRouter = require('./routes/user_route');
const app = express();

require('./config/env_config');

// 데이터베이스 연결
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, { //dbname, user, pw
    host: process.env.DB_HOST,
    dialect: 'mysql',
});

sequelize.authenticate() //연결 시도 후 콜백
    .then(() => console.log('DB 연결 성공'))
    .catch((err) => console.error('DB 연결 실패:', err));

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
