const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const { v1: uuidv1 } = require('uuid');

app.use(bodyParser.json());

// 회원가입 라우트
router.post('/signup', async (req, res) => {
  try {
    const { email, password, nickname, name, phone } = req.body; //req.body에서 추출
    const UUID = uuidv1();
    const user = await User.create({ UUID, email, password, nickname, name, phone }); //새로운 사용자 객체 생성 후 데이터베이스에 저장  <<< TODO: INSERT가 어떻게 진행되는지 >> connection 직접 생성하는 걸로 변경
    res.sendStatus(201).json({ message: "회원가입 성공", status: "S" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error_message: error.toString(), status: "E" });
  }
});

// 로그인 라우트
router.get('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } }); 
    if (!user || !(await user.verifyPassword(password)) || user.status == "D") { //유저 없거나 비밀번호 일치x경우 처리, 탈퇴한 회원 인경우
      res.status(401).json({ error_message: "유저가 존재하지 않거나 비밀번호가 일치하지 않습니다.", status: "E" });
    } else { //사용자 존재, 비밀번호 일치 시
      const token = jwt.sign({ userUUID: user.UUID }, process.env.JWT_SECRET, { expiresIn: '24h' }); //JWT 생성 후 아이디를 Payload로 하고 환경 변수 JWT_SECRET으로 서명 (?)
      res.json({ user: user, token, status: "S" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error_message: error.toString(), status: "E" });
  }
});

//회원탈퇴 라우트
router.delete('/delete', async (req, res) => {
  try {
    const now = require('../custom_modules/nowDate');
    const { email, password, status } = req.body;
    const user = await User.findOne({ where: { email } }); 
    console.log(user);
    if (!user || !(await user.verifyPassword(password))) { //유저 없거나 비밀번호 일치x경우 처리
      res.status(401).json({ error_message: "유저가 존재하지 않거나 비밀번호가 일치하지 않습니다.", status: "E" });
    } else { //사용자 존재, 비밀번호 일치 시
      const token = jwt.sign({ userUUID: user.UUID }, process.env.JWT_SECRET, { expiresIn: '24h' }); //JWT 생성 후 아이디를 Payload로 하고 환경 변수 JWT_SECRET으로 서명 (?)
      const user_result = await User.update({ status: "0", mod_date: now }, { where: { email } }); 
      res.json({ user: user_result, token, status: "S" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error_message: error.toString(), status: "E" });
  }
});

module.exports = router;
