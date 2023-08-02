const { sequelize, DataTypes, Model } = require('../custom_modules/database');
const bcrypt = require('bcryptjs');
class Users extends Model {
/*   UUID;
  email;
  password;
  nickname;
  name;
  phone;
  grade_code;
  auth_code;
  reg_date;
  mod_date;
  connection;
  status;

  //구조분해 할당 생성자
  constructor({UUID, email, password, nickname, name, phone, grade_code, auth_code, reg_date, mod_date, connection, status}={}, options) {
    super(options); //이거 자바에선 자동으로 해주지만 자바스크립트에서는 선언해야함
    this.UUID = UUID;
    this.email = email;
    this.password = password;
    this.nickname = nickname;
    this.name = name;
    this.phone = phone;
    this.grade_code = grade_code;
    this.auth_code = auth_code;
    this.reg_date = reg_date;
    this.mod_date = mod_date;
    this.connection = connection;
    this.status = status;
  } */

  async verifyPassword(password) {
    return await bcrypt.compare(password, this.password);
  }
}

Users.init(
  {
    UUID: {
      type: DataTypes.STRING,
      unique: true,
      primaryKey: true // UUID를 기본 키로 설정

    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      type: DataTypes.STRING
    },
    nickname: {
      type: DataTypes.STRING,
      unique: true,
    },
    name: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING
    },
    grade_code: {
      type: DataTypes.STRING
    },
    auth_code: {
      type: DataTypes.STRING
    },
    reg_date: {
      type: DataTypes.STRING
    },
    mod_date: {
      type: DataTypes.STRING
    },
    connection: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING
    },
  }, 
  { //여기부턴 옵션
    timestamps: false,
    freezeTableName: true,
    sequelize,
    modelName: 'Users',
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 10);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  },
  
);

module.exports = Users;
