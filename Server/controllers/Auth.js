const User=require("../models/User");
const OTP=require("../models/OTP");
const otpGenerator= require("otp-generator");
const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken');
require("dotenv").config();
const Profile= require("../models/Profile");

const {passwordUpdated} = require("../mail/passwordUpdate")
console.log('Attempting to import mailSender');
const mailSender = require("../Utils/mailSender")
console.log('mailSender imported:', mailSender);



// send OTP
exports.sendOTP = async (req, res) => {
    try{
        // fetch the mail
        const {email}= req.body;

        // check if the mail is already registered
        const checkUserPresent= await User.findOne({email});

        // if already present,return the response
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message: "User already exists",
            })
        }

        // generate OTP
        let otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("otp generated", otp);

        // check unique otp or not
        const result= await OTP.findOne({otp:otp});
        
        while(result){
        otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
           result= await OTP.findOne({otp:otp});
        }

        const otpPayload={email, otp};

        // create an entry in DB
        const otpBody= await OTP.create(otpPayload);
        console.log("otp created, and this body is going to store in the database", otpBody);

        // return response Successfully
        return res.status(200).json({
            success:true,
            message: "OTP sent successfully",
            otp,
        });
    }
    catch(error){
        console.log(error);
        return res.status(500)({
            success:false,
            message: error.message,
        });
    }
};

// SignUp
exports.signUp= async (req,res) => {
    try{
        // fetch the data from the reqiest ki body
        const {firstName, lastName,
             email, password, confirmPassword, accountType,
             contactNumber, otp} = req.body;


            // validate karo ab
            if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
                return res.status(403).json({
                    success:false,
                    message:"All fields are required",
                })
            }
            // 2 password ko match karo same h ya nhi
            if(password !== confirmPassword){
                return res.status(400).json({
                    success:false,
                    message:"Password and Confirm Password does not match, please try again",
                });
            }

            // /check user already exits or not
            const existingUser = await User.findOne({email});
            if(existingUser){
                return res.status(400).json({
                    success:false,
                    message:"User is already registered",
                });
            }

            // find most recent otp
            const recentOtp = await OTP.findOne({email, otp}).sort({createdAt: -1}).limit(1);
            console.log(recentOtp);

            // validate the otp
            if(recentOtp.length==0){
                // otp not found
                return res.status(400).json({
                    success:false,
                    message:"OTP not found",
                });
            }
            else if(otp != recentOtp.otp){
                return res.status(400).json({
                    success:false,
                    message:"Invalid OTP",
                });
            }

            // Hash the password if otp we get is valid
            const hashedPassword= await bcrypt.hash(password,10);

            // Create the user
            let approved = "";
            approved === "Instructor" ? (approved = false) : (approved = true);


            // additional information of the user
            const profileDetails= await Profile.create({
                gender:null,
                dateOfBirth:null,
                about:null,
                contactNumber:null,
            });

            // create a entry in db
            const user = await User.create({
                firstName, 
                lastName,
                email, 
                accountType:accountType,
                approved:approved,
                contactNumber,
                password:hashedPassword,
                additionalDetails: profileDetails._id,
                image:`http://api.dicebear.com/9.x/initials/svg?seed=${firstName}${lastName}`,
            });

            return res.status(200).json({
                success:true,
                message:"user is registered successfully",
                data:user,
            });;
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"user can't be registered, please try again",
        });
    }
};

// Login
exports.logIn= async (req,res)=>{
    try{
        // get data from req body
        const {email, password}= req.body;
        // validate the data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"Please enter both email and password",
            })
        }
        // check the user exit or not
        const user= await User.findOne({email}).populate("additionalDetails");
        if(!user){
            // Returning 401 Unauthorized status code with error message
            return res.status(401).json({
                success:false,
                message:"user is not register please register first",
            });
        }

        // generate JWT, after matching the password
        if(await bcrypt.compare(password, user.password))
        {
            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }
            const token= jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            });
            user.token=token;
            user.password=undefined;

            // create cookie and send response
            const options={
                expires:new Date(Date.now()+ 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:"User Logged In successfully",
            });
        }
    else{
            return res.status(401).json({
                success:false,
                password:'password is incorrect',
            });
        }

    }
    catch(error){
        console.log(error);
        // Return 500 Internal Server Error status code with error message
        return res.status(500).json({
            success:false,
            message:"Login failed please ty again later",
        });
    }
}

// Changing the password
exports.changePassword = async (req, res) => {
    console.log('mailSender function:', mailSender); // Add this line to check the import

    try{
        // get the data from the user body
        const userDetails= await User.findById(req.user.id);
       // console.log("user data ", userDetails);
        
        // get oldPassword, newPassword, ConfirmPassword
        const {oldPassword, newPassword}=req.body;

        // validate the oldpassword
        const isOldPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password);
        if(!isOldPasswordMatch){
            // If old password does not match with the password enter by the user, return a 401 (Unauthorized) error
			return res.status(401).json({
                 success: false, 
                 message: "The password is incorrect" 
            });
        }

        // here confirmpassword ki neend nhi h since update kr rahe h old password de kr....
        // here means old password is correct so check the new password with confirm one
        // if(newPassword !== ConfirmPassword){
        //    // return a 400 (Bad Request) error
		// 	return res.status(400).json({
		// 		success: false,
		// 		message: "The password and confirm password does not match, Please check",
		// 	});
        // }

        // update the password in DB
        const encryptedPassword= await bcrypt.hash(newPassword,10);
        const updatedUserDetails= await User.findByIdAndUpdate(req.user.id, 
                                                              { password:encryptedPassword},
                                                              // new: true to return the updated user details
                                                              {new: true}
                                                              ); 
        // send the mail that password is updated
        try{
            const emailSender= await mailSender(
                updatedUserDetails.email,
                "Password Updated",
                passwordUpdated(
                    updatedUserDetails.email,
                    `Password Updated successfully for ${updatedUserDetails.firstName}${updatedUserDetails.lastName}`
                )
            );
            console.log("email sent successfully: ", emailSender.response);
        }
        catch(error){
            console.log("Error while sending email: ", error.message);
            return res.status(500).json({
                success: false,
                message: "Error while sending email",
                error:error.message,
                data:userDetails
            });
        }


        // return success response
        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
        

    }
    catch (error) {
		// error in updating the password, show error and 500(internal server Error)
		console.error("Error occurr while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};
