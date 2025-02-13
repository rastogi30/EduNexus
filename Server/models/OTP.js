const mongoose=require("mongoose");
const mailSender = require("../Utils/mailSender");
const otpTemplate = require("../mail/emailVerificationTemplate")

const OTPSchema= new mongoose.Schema({
 email:{
    type:String,
    require:true,
 },
 otp:{
    type:String,
 },
 createdAt:{
    type:Date,
    default:Date.now(),
    expire:5*60,
 },
});

// a function to send mail
async function sendVerificationEmail(email,otp){
    try{
        const mailResponse= await mailSender(email, "Verification Email from Study Notion", otpTemplate(otp));
        console.log("email send successfully: ", mailResponse);
    }
    catch(error){

        console.log("error occur while sending the mail:", error);
        throw error;
    }
}

OTPSchema.pre("save", async function(next){
    sendVerificationEmail(this.email, this.otp);
    next();
})

module.exports=mongoose.model("OTP", OTPSchema);