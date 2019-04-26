var express = require('express');
var router = express.Router();
var db = require('./connection');
var uuid = require('uuid');
var bcrypt = require('bcrypt');

const saltRounds = 10;


router.post('/',(req,res)=>{
    res.render('registration'); 
 });

router.post('/register',(req,res)=>{
    var cmd = "select * from user_info where account="+"\""+req.body.username+"\"";
    cmd = cmd.replace('\'','');
    db.query(cmd,(err,result)=>{
        if(err)
        {
            console.log(err);
            res.send('SERVER ERROR');
        }
            if(result != '')
            {
                res.send('此帳號已註冊!');
            }
            else{
                var id = uuid.v4();
                console.log("pass is "+req.body.password);
            
                var hash = bcrypt.hashSync(req.body.password,saltRounds);
                // Store hash in your password DB.
                var cmdtest = `INSERT INTO user_info(\`uuid\`, \`account\`, \`password\`, \`email\`) VALUES (\"${id}\",\"${req.body.username}\",\"${hash}\",\"${req.body.email}\")`;
                console.log(cmdtest);
                db.query(cmdtest,(err,result)=>{
                    if(err)
                    {
                        console.log(err);
                    }
                    else{
                        res.send('已註冊完成!');
                    }
                })
                  
              
            }
    });    
});
module.exports = router;
