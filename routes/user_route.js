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
    const { email, password, nickname, name, phone } = req.body; //HTTP Request의 Body에서 추출 *객체구조 분해* 이용
    const UUID = uuidv1();
    const user = await User.create({ UUID: UUID, email: email, password: password, nickname: nickname, name: name, phone: phone }); //await User.create 메소드를 통해 DB에 접근하여 INSERT
    const token = jwt.sign({ userUUID: user.UUID }, process.env.JWT_SECRET, { expiresIn: '24h' }); //JWT
    res.sendStatus(201).json({ token: token, message: "회원가입 성공", status: "S" }); //HTTP response 클라이언트에게 송신
  } catch (error) {
    res.status(500).json({ error_message: error.toString(), status: "E" });
  }
});

// 로그인 라우트
router.get('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });

    if (!user || !(await user.verifyPassword(password)) || user.status == "0") { //유저 없거나 비밀번호 일치하지 않거나 탈퇴한 회원 일 경우
      res.status(401).json({ error_message: "유저가 존재하지 않거나 비밀번호가 일치하지 않습니다.", status: "E" }); //에러 처리

    } else {
      const token = jwt.sign({ userUUID: user.UUID }, process.env.JWT_SECRET, { expiresIn: '24h' }); //JWT
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
    const { email, password, status } = req.body;
    const user = await User.findOne({ where: { email: email } }); //회원 탈퇴할 회원 조회 (email 기준)

    if (!user || !(await user.verifyPassword(password))) { //유저 없거나 비밀번호 일치하지 않는 경우
      res.status(401).json({ error_message: "유저가 존재하지 않거나 비밀번호가 일치하지 않습니다.", status: "E" });

    } else {
      const token = jwt.sign({ userUUID: user.UUID }, process.env.JWT_SECRET, { expiresIn: '24h' }); //JWT
      const user_result = await User.update({ status: "0", mod_date: now }, { where: { email } }); //해당 회원의 상태를 탈퇴로 변경
      res.json({ user: user_result, token, status: "S" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error_message: error.toString(), status: "E" });
  }
});

//정보 수정 라우트
router.put('/modify', async (req, res) => {
  try {
    const now = require('../custom_modules/nowDate'); //커스텀 모듈을 이용해 현재 시간 불러옴
    const { email, password, nickname, name, phone } = req.body;
    const user = await User.findOne({ where: { email: email } }); //email 기준으로 정보 수정 할 유저 DB에서 찾아와서 인스턴스화(Users 모델)

    if (!user) { //유저가 없는경우
      res.status(401).json({ error_message: "유저가 존재하지않습니다.", status: "E" });

    } else {
      const token = jwt.sign({ userUUID: user.UUID }, process.env.JWT_SECRET, { expiresIn: '24h' }); //JWT
      const updatedUser = { UUID: user.UUID, email: email, password: password, nickname: nickname, name: name, phone: phone, mod_date: now }; //UPDATE된 유저 결과를 보여주기 위한 객체
      const userCount = await User.update({ pasword: password, nickname: nickname, name: name, phone: phone, mod_date: now }, { where: { UUID: userUUID } });  //DB접근 (user UUID를 기준으로 데이터 UPDATE)
      res.json({ count: userCount, update_result_user: updatedUser, token, status: "S" }); //UPDATE결과 HTTP response로 전송
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error_message: error.toString(), status: "E" });
  }
});

module.exports = router;