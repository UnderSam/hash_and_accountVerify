const express = require('express');
const router = express.Router();
var members = require('../../Members');
// /api/members/
router.get('/', (req,res)=>{
    res.render('members.ejs',{
        _title:'使用者',
        _p1:'清單1 ',
        user:members
    });
});

router.get('/:id',(req,res)=>{
    const found = members.some(member=>member.id === parseInt(req.params.id));

    if (found){
    res.json(members.filter(member=>member.id === parseInt(req.params.id))); //member.id是string所以要parseInt
    }
    else{
        res.status(400).json({msg: `No member with the id of ${req.params.id}`});
    }
});

//Create Member 只要方法不一樣可用一樣的router
router.post('/',(req,res)=>{
    res.send(req.body);
});

module.exports = router;