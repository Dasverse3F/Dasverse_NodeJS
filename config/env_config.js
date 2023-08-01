const path = require('path');
require('dotenv').config({path: path.resolve(__dirname+'\\.env')});
console.log(process.env.DB_HOST);
console.log(__dirname+'\\.env');