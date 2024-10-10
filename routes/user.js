//POST /users/signup Description: Creates a new user account. Input: { username: 'user', password: 'pass' } Output: { message: 'User created successfully' }
//POST /users/signin Description: Logs in a user account. Input: { username: 'user', password: 'pass' } Output: { token: 'your-token' }
//GET /users/courses Description: Lists all the courses. Input: Headers: { 'Authorization': 'Bearer ' } Output: { courses: [ { id: 1, title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }, ... ] }
//POST /users/courses/:courseId Description: Purchases a course. courseId in the URL path should be replaced with the ID of the course to be purchased. Input: Headers: { 'Authorization': 'Bearer ' } Output: { message: 'Course purchased successfully' }
//GET /users/purchasedCourses Description: Lists all the courses purchased by the user. Input: Headers: { 'Authorization': 'Bearer ' } Output: { purchasedCourses: [ { id: 1, title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }, ... ] }
const {Router} = require("express");
const router = Router();
const jwt = require("jsonwebtoken");
const {User,Course} = require("../db/index")
const userMiddleware = require("../middlewares/user")
const {JWT_SECRET }= require("./config")
router.post("/signup",async(req,    res)=>{
    const username = req.body.username;
    const password = req.body.password;
    await User.create({
        username:username,
        password:password
    })
    res.json({msg:"User created successfully"})
});
router.post("/signin",async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const user = await User.find({
        username,password
    })
    if(user){
        const token = jwt.sign({username},JWT_SECRET);
        res.json({token});
    }
    else{
        res.status(411).json({msg:"Not an existing user"})
    }
})
router.get("/courses",userMiddleware,async(req,res)=>{
    const courses = await Course.find();
    res.json({courses:courses})
})
router.post("/courses/:courseId",userMiddleware,async(req,res)=>{
    const courseId = req.params.courseId;
    const username = req.username;
    await User.updateOne(
        { username:username},
        {"$push":{purchasedCourses:courseId}})
    res.json ({msg:"Course Purchased successfully"});
})
router.get("/purchasedcourses",userMiddleware,async(req,res)=>{
    const username = req.username;
    const users = await User.findOne({username:username});
    const purchasedCourses = await Course.find({
        _id: {
            "$in": users.purchasedCourses
        }
    });
    res.json({purchasedCourses:purchasedCourses})
});
module.exports=router;