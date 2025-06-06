const mongoose=require("mongoose");

const sectionSchema=new mongoose.Schema({
    sectionName:{
        type:String,
    },
    subSection:[{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"subSection",
    }]
});

module.exports=mongoose.model("Section", sectionSchema);

