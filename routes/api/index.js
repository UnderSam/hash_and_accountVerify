var express = require('express');
var router = express.Router();
var db = require('./connection');

router.get('/',(req,res)=>{
    res.render('index');
});
router.post('/tologin',(req,res)=>{
    res.redirect('/login');
});

router.post('/testdb',(req,res)=>{
    var cmd = 'select * from clientinfo';
    db.query(cmd,(err,result)=>{
        if(err)
        {
            console.log(err);
        }
        res.send(result);
    }) 

})
module.exports = router;