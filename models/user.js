const { Sequelize, DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');

// 데이터베이스 연결
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, { //dbname, user, pw
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

class Users extends Model {
  async verifyPassword(password) {
    return await bcrypt.compare(password, this.password);
  }
}

Users.init(
  {
    UUID: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      primaryKey: true, // UUID를 기본 키로 설정

    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nickname: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false
    },
    grade_code: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true
    },
    auth_code: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true
    },
    reg_date: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true
    },
    mod_date: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true
    },
    connection: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true
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
