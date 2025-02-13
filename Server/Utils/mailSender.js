const nodemailer=require("nodemailer");
require("dotenv").config();

const mailSender= async(email, title, body) => {
    try{
        let transporter=nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
        })

        let info=await transporter.sendMail({
            from:"Study Notion by ansh",
            to: `${email}`,
            html:`${body}`,
            subject:`${title}`,
        })
        console.log("mail info: ",info);
        return info;

    }
    catch(err){
        console.log("Error.message");
    }
}

module.exports=mailSender;