const express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
const app = express();
const logger = require('./middleware/logger');

//Set ejs as view engine 
app.set('view engine','ejs');
//Specify the folder to render
app.set('views',path.join(__dirname,'views'));

//middleware init
app.use(logger);//這是自訂的可以不用
//新版Express包含bodyparser
app.use(bodyParser.json());//只處理json資料的mw
app.use(bodyParser.urlencoded({extended: false}));//處理form的資料
app.use('/',require('./routes/api/index'));
app.use('/login',require('./routes/api/login'));
app.use('/registration',require('./routes/api/registration'));
app.use('/api/members/',require('./routes/api/member'));


//Static Path
app.use(express.static(path.join(__dirname,'public')));

//看環境變數的PORT值能不能用不能就先3000
const PORT = process.env.PORT ||3000;
app.listen(PORT,()=>console.log(`Listening on port ${PORT} ...`));
module.exports = app;
