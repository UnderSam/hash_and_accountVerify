const moment = require('moment')
//範例middleware
const logger = (req,res,next)=>{
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}: ${moment().format()}`);
    next();
}
//你會發現任何req都會觸發


module.exports = logger;