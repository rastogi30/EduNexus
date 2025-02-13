const RatingAndReviews=require("../models/RatingAndReview");
const Course= require("../models/Course");
const { default: mongoose } = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// create rating
exports .createRating = async (req, res) => {
    try{

        // get the user 
        const userId=req.user.id;
        // fetch the data from req body
        const {rating, review, courseId} = req.body;
        // check if the user is enrolled or not
        console.log("CreateRating mei kya data aya...", userId, rating, review, courseId);
        const courseDetails = await Course.findOne(
                                                {_id:courseId,
                                                 studentEnrolled: {$elemMatch: {$eq: userId}},
                                                });

        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"Studnent is not enrolled in this Course",
            });
        }                                      

        // check if user already review the course
        const alreadyReviewed= await RatingAndReviews.findOne({
                                                            user:userId,
                                                            course:courseId,
                                                    });
        
        if(alreadyReviewed){
            return res.status(400).json({
                success:true,
                message:"You already reviewed this course",
            });
        }
        // create rating and review
        const ratingReview = await RatingAndReviews.create({
                                                            rating, review, 
                                                            user:userId, 
                                                            course:courseId,
                                                         });
      
        // update course with this rating and review
        const updatedCourseDetails=await Course.findByIdAndUpdate({_id:courseId},
                                    {
                                        $push:{
                                            ratingAndReviews:ratingReview._id,  
                                        }
                                    },
                                {new:true},)

        console.log("update ke baad kya aya...",updatedCourseDetails);
        // return response
        return res.status(200).json({
            success:true,
            message:"Rating and Review created successfully",
            ratingReview,
        });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });

    }
}

// average rating
exports.getAverageRating = async (req,res) => {
    try{
        // get courseId
        const courseId= req.body.courseId;

        // calculate the avg rating
        const result= await RatingAndReviews.aggregate([
            {
                $match:{
                    course: mongoose.Types.ObjectId(courseId),
                },
            },
            {
              $group:{
                _id:null,
                averageRating:{$avg:"$rating"},
              }
            }
        ])

        // reuturn
        if(result.length>0){
            return res.status(200).json({
                success:true,
                message:"Average Rating found",
                averageRating:result[0].averageRating,
            });
        }

        // if no rating found
        // return res.status(200).json({
        //     success:true,
        //     message:"Average Rating is 0, no rating is given till now",
        //     averageRating:0,
        // });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

// get allRatingsAndReview
exports.getAllRatings = async (req,res) => {
    try{
        const allReviews= await RatingAndReviews.find({})
                                               .sort({rating:"desc"})
                                               .populate({
                                                path:"user",
                                                select:"firstName lastName email image",
                                               })
                                               .populate({
                                                path:"course",
                                                select:"courseName",
                                               })
                                               .exec();
        return res.status(200).json({
            success:true,
            message:"All Ratings and Reviews found",
            data:allReviews,
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
             message:"Issue in getting all ratings,server faults",
        });
    }
}