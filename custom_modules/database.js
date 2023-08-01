require('../config/env_config');
const { Sequelize, DataTypes, Model } = require('sequelize');

// 데이터베이스 연결
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, { //dbname, user, pw
    host: process.env.DB_HOST,
    dialect: 'mysql',
});

sequelize.authenticate() //연결 시도 후 콜백
    .then(() => console.log('DB 연결 성공'))
    .catch((err) => console.error('DB 연결 실패:', err));

module.exports = {sequelize, DataTypes, Model};