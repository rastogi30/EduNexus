const jwt= require("jsonwebtoken");
require("dotenv").config();
const User= require("../models/User");

// auth
exports.auth= async (req,res,next)=>{
    try{
        // extract token three ways
        const token= req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ","");

        // is token is missing then return the response
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing",
            });
        }
        // verify the token
        try{
            const decode= jwt.verify(token, process.env.JWT_SECRET);
            console.log("decode ", decode);
            req.user= decode;

        }
        catch(error){
           // verification ->issue
            return res.status(401).json({
                success:false,
                message:"token is invalid",
            });
        };
        next();
    }
    
    catch(error){
        return res.status(401).json({
            success:false,
            message:"something went wrong while validating the token",
        });
    }
}

// isStudent
exports.isStudent = async (req, res, next) => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "this is the protected route for students only",
            });
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"User role can't verified",
        });
    }
}

// isInstructor
exports.isInstructor = async (req, res, next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "this is the protected route for Instructor only",
            });
        };
        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"User role can't verified",
        });
    }
}

// isAdmin
exports.isAdmin = async (req, res, next) => {
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "this is the protected route for Admin only",
            });
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"User role can't verified",
        });
    }
}

