var mysql = require("mysql");
var connection = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"",
  database:"clientdb",
  port:3306
});

connection.connect((err)=>{
    if(err){
      console.log('***cannot connect mysql');
    }
  else{
      console.log("connected to mysql");
  }
  })
module.exports = connection;