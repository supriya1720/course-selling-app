const jwt = require("jsonwebtoken");
const secret = require("../routes/config");
function userMiddleware(req,res,next){
    const token = req.headers.authorization;
    console.log(token, secret)
    const words = token.split(" ");
    const jwtToken = words[1];
    const decodedvalue = jwt.verify(jwtToken, secret.JWT_SECRET);
        if(decodedvalue.username){
            req.username = decodedvalue.username;
            next();
        }
        else{
            res.status(400).json({msg:"You are not authenticated"})
        }
}
module.exports = userMiddleware;