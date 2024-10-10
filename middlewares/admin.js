const jwt = require("jsonwebtoken");
const secret = require("../routes/config");
function adminMiddleware(req,res,next){
    const token = req.headers.authorization;
    //console.log(token, secret)
    const words = token.split(" ");
    const jwtToken = words[1];
    try{
        const decodedvalue = jwt.verify(jwtToken, secret.JWT_SECRET);
        if(decodedvalue.username){
            next();
        }
        else{
            res.status(403).json({
                msg:"you are not authenticated"
            })
        }
    }
    catch(e){
        res.json({msg:"Incorrect input"})
    }
}
module.exports = adminMiddleware;