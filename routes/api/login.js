const express = require('express');
const router = express.Router();
var bcrypt = require('bcrypt');
var db = require('./connection');
var app = express();
var request = require('request');
var config = require("../../config/config.js");
var port = 3000;

router.get('/',(req,res)=>{
   res.render('login'); 
})
router.get('/registration',(req,res)=>{
    res.redirect('/registration');
});

router.post('/dologin',(req,res)=>{
    var olduser = {
        username:req.body.username,
        password:req.body.password,
    };
    var cmd = "select * from user_info where account="+"\""+olduser.username+"\"";
    cmd = cmd.replace('\'','');
    console.log(cmd);
    db.query(cmd,(err,result)=>{
       if(err)
       {   
           console.log(err);
       };
       console.log('【Result】');
       console.log(result);
       console.log('長度='+result.length.toString());
       var hash = result[0].password;
       if(result=='')
       {
            res.send('使用者不存在');
       }
       else{

           if(!bcrypt.compareSync(olduser.password, hash)){
                res.send('密碼錯誤');
           }
           else{
                res.send(`歡迎回來! ${olduser.username}`);
           }
    }
    });
    console.log(olduser);
});

var githubOAuth = require('github-oauth')({
  githubClient: config.GITHUB_KEY,
  githubSecret: config.GITHUB_SECRET,
  baseURL: 'http://localhost:' + port,
  loginURI: '/login/auth/github',
  callbackURI: '/login/auth/github/callback'
})

router.get("/auth/github", function(req, res){
  console.log("started oauth");
  return githubOAuth.login(req, res);
});

router.get("/auth/github/callback", function(req, res){
  console.log("received callback");
  return githubOAuth.callback(req, res);
});

githubOAuth.on('error', function(err) {
  console.error('there was a login error', err)
})

githubOAuth.on('token', function(token, res) {
  let access_token = token['access_token'];
  let auth_url = 'https://api.github.com/user?access_token='+access_token;
  var options = {
    uri:auth_url,
    headers: { // github require request must have user agent headers.
              'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36",
          "Accept-Language":"en-US,en;q=0.9",
          "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
          "Connection":"keep-alive"
  },
  json: true // Automatically parses the JSON string in the response.
  };
  console.log('auth url :'+ auth_url);
  request(options, function (error, response, body) {
     // Print the error if one occurred
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
    if(response.statusCode==200){
      //res.end(JSON.stringify(body));
      res.send('Hello ! '+body['login'])
      console.log('login success !');
    }
    else{
      res.end(error);
    }
  });
})
//Create Member 只要方法不一樣可用一樣的router
router.post('/',(req,res)=>{
    res.send(req.body);
});

module.exports = router;