const {Router} = require("express");
const jwt = require("jsonwebtoken");
const adminMiddleware = require("../middlewares/admin");
const {Admin,User,Course} = require("../db/index");
const router = Router();
const {JWT_SECRET} = require("./config");
router.post("/signup",async(req,res)=>{            
    const username = req.body.username;
    const password = req.body.password;
    await Admin.create({                    //assuming no admin tries to signup twice
        username:username,
        password:password
    })
    res.json({msg:"Admin created successfully"})
});
router.post("/signin",async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const user = await User.find({
        username, password
    })
    if(user){
        const token = jwt.sign({username},JWT_SECRET);
        res.json({token})
    }else{
        res.status(411).json({msg:"Incorrect email and password"})
    }  
})
router.post("/courses",adminMiddleware,async(req,res)=>{
    const authorization = req.headers.authorization;
    const title = req.body.title;
    const description = req.body.description;
    const imageLink = req.body.imageLink;
    const price = req.body.price;
        const courseCreated = await Course.create({
            title:title,
            description:description,
            imageLink:imageLink,
            price:price
        })
    console.log(courseCreated);
    res.json({msg:"Course created successfully",courseId:courseCreated._id});  //displaying course id of created courses
})
router.get('/course',adminMiddleware,async(req,res)=>{
    const courses = await Course.find();
    res.json({courses : courses});    
    /*here we are using admin middleware for accessing courses or reading what courses are there
    but at the same time for users in the other file we are not using middleware as in the real word if we implement this then we 
    will have an option of isPublished : true or false which if true then will be seen by every user, if not then will be seen 
    only by admins who created it.
    */
})
module.exports = router;