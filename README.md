# HASH
## What is Hash ?
雜湊（英語：Hashing）是電腦科學中一種對資料的處理方法，通過某種特定的函式/演算法（稱為雜湊函式/演算法）將要檢索的項與用來檢索的索引（稱為雜湊，或者雜湊值）關聯起來，生成一種便於搜尋的資料結構（稱為雜湊表）。舊譯哈希（誤以為是人名而採用了音譯）。它也常用作一種資訊安全的實作方法，由一串資料中經過雜湊演算法（Hashing algorithms）計算出來的資料指紋（data fingerprint），經常用來識別檔案與資料是否有被竄改，以保證檔案與資料確實是由原創者所提供。

如今，雜湊演算法也被用來加密存在資料庫中的密碼（password）字串，由於雜湊演算法所計算出來的雜湊值（Hash Value）具有不可逆（無法逆向演算回原本的數值）的性質，因此可有效的保護密碼。

## hash function
主要是將不定長度訊息的輸入，演算成固定長度雜湊值的輸出，且所計算出來的雜湊值必須符合兩個主要條件：

#### 1. 由雜湊值是無法反推出原來的訊息
#### 2. 雜湊值必須隨明文改變而改變。
舉例來說，雜湊函數就像一台果汁機，我們把蘋果香蕉你個芭樂 (資料) 都丟進去打一打、攪一攪，全部變得爛爛的很噁心對吧？！這時候出來的產物 (經過雜湊函數後的值)，是獨一無二的，沒有辦法反向組合成原來的水果 (資料)。倘若我們把蘋果改成紅龍果，出來的產物 (經過雜湊函數後的值) 就會跟著改變，變成桃紅色的，不再是原來的淡黃色。

## hash table
在用雜湊函數運算出來的雜湊值，根據 鍵 (key) 來儲存在數據結構中。而存放這些記錄的數組就稱為 **雜湊表**。

舉例來說，我們有一筆資料用字典的形式表示，每個名字都搭配性別：
```
{Joe:'M', Sue:'F', Dan:'M', Nell:'F', Ally:'F', Bob:'M'}
```
然後每個字都進行運算
```
(Key)                 (hash value)     (stored index)
Joe  → (Hash function) →   4928   mod 5   =   3
Sue  → (Hash function) →   7291   mod 5   =   1
Dan  → (Hash function) →   1539   mod 5   =   4
Nell → (Hash function) →   6276   mod 5   =   1
Ally → (Hash function) →   9143   mod 5   =   3
Bob  → (Hash function) →   5278   mod 5   =   3
```
最後再利用mod5來取餘數儲存到DB中，重複的就排在同個BUCKET中
```
0： 
1： [ Sue, F ] → [ Nell, F ]
2： 
3： 
4： [ Joe, M ] → [ Ally, F ] → [ Bob, M ]
5： [ Dan, M ]
```
---
# 帳密驗證
## General
一般人認定的帳密驗證可能如下 : 

![](https://i.imgur.com/jTcM7gf.png)

假設一個情況，今天HACKER破解了我方的資料庫，那受害的當然就是ALICE跟BOB，這邊如果ALICE比較偏向不同網站使用不同密碼，那她的其他APP就會免於災難，BOB如果跟我一樣喜歡一堆APP都用同一個密碼的話，這就是災難的開始。
為了解決這個問題，我們需要先把使用者的密碼經過hash來產生一個不可逆的password_digest，經過hash function後，資料表會長這樣 :

![](https://i.imgur.com/OHTTn6b.png)

這樣子就可以初步的預防簡單破解的攻擊，可是還是需要防範所謂的dictionary attacks，假設BOB今天在其他的網站密碼被hacker知道，那hacker就可以建立所謂的password_digest table : 

![](https://i.imgur.com/DwwuGyS.png)

然後就又爆炸了，為此SALT演算法就出現了。

## Salt algorithm
在PlainText中摻雜一些佐料來使密碼不容易被破解
比如用戶使用了一個密碼 : 
```
x7faqgjw
```
經過雜湊後，可以得出結果 : 
```
58ecbf2b3136ceda7fddfd986ba8bd8d59b2d73779691e839f3f176ce2c04b84

```
但是由於用戶密碼位數不足，短密碼的雜湊結果很容易被[彩虹表](https://zh.wikipedia.org/wiki/%E5%BD%A9%E8%99%B9%E8%A1%A8)(也就是字典攻擊)破解，因此，在用戶的密碼末尾添加特定字串（綠色字型為加鹽的欄位）：
```
x7faqgjwabcdefghijklmnopqrstuvwxyz
```
因此，加鹽後的密碼位數更長了，雜湊的結果也發生了變化：
```
7b5001a5a8bcdcfa1b64d41f6339cfa7a5c0eca04cca6ff6a6c1d6aad17794cc
```
### CODE TEMPLATE
```
<?php
function hash($a) {
    $salt="SALTANDPEPPER"; //define a salt word : WIKIPEDIA
    $b=$a.$salt; //concate two words。
    $b=sha($b); //run SHA hashing。
    return $b; //return the sequence。
}
?>
```
## Bcrypt
BCrypt 怎麼組成的？
```
$2a$(2 chars work cost)$(22 chars salt 隨機的鹽含符號)(31 chars hash 加密的hash含符號)
```
BCrypt加密方式就是配合cost參數，再隨機的產生salt對密碼加密，加密完成之後就會直接接在salt的後面變成一組60字元的Hash。

假設password = 12345678 ， cost = 11

這樣會先隨機產生一組salt= EvgzzV0AGkKwv3bEiYKx4O

然後再用salt加密密碼12345678會變成 
`TDoUubTaZm/MgHzRq/.Th4H6M3lmMLW `
最後在全部接在一起就會變成
`$2a$11$EvgzzV0AGkKwv3bEiYKx4OTDoUubTaZm/MgHzRq/.Th4H6M3lmMLW`

#### 以下程式碼以NODE.JS演示(感謝袁兄支援)

### Register
```
var express = require('express');
var router = express.Router();
var db = require('./connection');
var uuid = require('uuid');
var bcrypt = require('bcrypt');

const saltRounds = 10;

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
```
### Login
```
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
```
實際測試，密碼為 12345 , cost = 10 ， 結果為

![](https://i.imgur.com/k6I4ThA.png)

參考講義 : 

1. https://github.com/lustan3216/BlogArticle/wiki/BCrypt-%E5%8A%A0%E5%AF%86%E6%BC%94%E7%AE%97%E6%B3%95%E7%B2%BE%E9%97%A2%E8%A7%A3%E9%87%8B
2. https://zh.wikipedia.org/zh-tw/%E7%9B%90_(%E5%AF%86%E7%A0%81%E5%AD%A6)
3. https://ithelp.ithome.com.tw/articles/10208884
4. https://www.youtube.com/watch?v=O6cmuiTBZVs
