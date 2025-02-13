const mongoose=require("mongoose");
require("dotenv").config();

exports.connect =()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        //useNewUserParser:true,
        //useUnifiedTopology:true,

    })
    .then(()=>console.log("DataBase Connected Successfully"))
    .catch((error)=>{
        console.log("DB connection failed")
        console.log(error);
        process.exit(1);
    })
}