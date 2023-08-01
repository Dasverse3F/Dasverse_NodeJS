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
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } }); //email, password 기준으로 사용자 찾음 // 여기서 password를 가져와서 비교해야됨
    if (!user || !(await user.verifyPassword(password))) { //유저 없거나 비밀번호 일치x경우 처리
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
router.delete('/withdrawal', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.delete({ where: { email } });
  } catch (error) {

  }
});

module.exports = router;
