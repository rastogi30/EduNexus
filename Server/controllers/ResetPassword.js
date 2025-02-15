const User = require("../models/User");
const mailSender = require("../Utils/mailSender");
const bcrypt=require("bcryptjs")
const crypto = require("crypto");

// resetPasswordToken
exports.resetPasswordToken = async(req,res)=> {
    try{
        // get email from the user body
        const email=req.body.email;
        // check the user for this email, email validation
        const user= await User.findOne({email:email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:`This Email: ${email} is not register with us, Enter the valid One`,
            });
        }
        // generate token
        const token = crypto.randomBytes(20).toString("hex");

        // update user by token in the data base and expiration time 
        const updateDetails = await User.findOneAndUpdate({email:email},
                                                            {
                                                                token:token,
                                                                resetPasswordExpires:Date.now()+3600000,
                                                            },
                                                            // is new se update value return hoti h
                                                            {new:true});

        console.log("DETAILS", updateDetails);

        // create URL
        // const url= `http://localhost:3000/update-password/${token}`;
         const url= `https://edunexus-edtech.vercel.app/update-password/${token}`;

        // send email conatining the URL
         await mailSender(email, "Password Reset Link", 
                        `Your Link for email verification is ${url}. Please click this url to reset your password.`);                                                       
        // return response
        return res.json({
            success:true,
            message:'Email sent successfully, please check the email and change the password',
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'something went wrong while reset the password',
        });
    }
}

// Reset Password
exports.resetPassword= async (req,res)=>{
    try{
        // fetch the data
        const {token, password, confirmPassword}= req.body;

        // validation
        if(password!== confirmPassword){
            return res.json({
                success:false,
                message:'password is not matching',
            });
        }
        // get user details from db using token
        const userDetails= await User.findOne({token:token});
        
        // if no entry => invalid token
        if(!userDetails){
            return res.json({
                success:false,
                message:'token is invalid',
            });
        }
        // token time expire
        if( userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success:false,
                message:'token is expire, please regenerate the token',
            });
        }

        // hash the password
        const hashedPassword= await bcrypt.hash(password,10);

        // upate the password
        await User.findOneAndUpdate({token:token},
                                    {password:hashedPassword},
                                    {new:true},
        );
        // return response
        return res.status(200).json({
            success:true,
            message:'Password reset successfully',
        });

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message: `Some Error in Updating the Password`,
            error:error.message,
        });
    }
};