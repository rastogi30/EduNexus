const Course = require("../models/Course");
const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../Utils/imageUploader");
const {convertSecondsToDuration } = require("../Utils/secondToDuration")
const CourseProgress = require("../models/CourseProgress")


// update the profile
exports.updateProfile = async (req, res) => {
    try{
        // get the data
        const {dateOfBirth="" , about="", contactNumber, gender, firstName, lastName}= req.body;
        // get the user ID
        const userId=req.user.id;
        // validation
        // if(!contactNumber || !gender || !userId){
        //     return res.status(400).json({
        //         success:false,
        //         message: "Please fill in all fields",
        //     });
        // }
        // find profile
        const userDetails= await User.findById(userId);
        const profileId= userDetails.additionalDetails;
        const profileDetails= await Profile.findById(profileId)
        .populate()
        .exec();
        const user = await User.findByIdAndUpdate(userId,{
          firstName:firstName,
          lastName:lastName,
        })
        await user.save();

        //update the profile 
        profileDetails.dateOfBirth=dateOfBirth;
        profileDetails.about=about;
        profileDetails.gender=gender;
        profileDetails.contactNumber=contactNumber;
        // object bana hua h to db me store kr ne ke liye only save function use
        await profileDetails.save();

        const updatedUserDetails=await User.findById(userId)
        .populate("additionalDetails")
        .exec();


        // return the response
        return res.status(200).json({
            success:true,
            message:'profile Updated successfully',
            updatedUserDetails
        });
  
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'something went wrong in updating the profile',
            error:error.message,
        });
    }
};

// delete handler
// how can we schedule the delete operation?
exports.deleteProfile = async (req, res) => {
    try{
        // get the user ID
        const id= req.user.id;
        // validation
        const userDetails= await User.findById(id);
        if(!userDetails){
            return res.status(402).json({
                success:false,
                message: "incorrect userId",
            });
        }
        // delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        // delete user
        await User.findByIdAndDelete({_id:id});
        // return the response
        return res.status(200).json({
            success:true,
            message:'profile deleted successfully',
        });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'something went wrong in deleting the profile',
            error:error.message,
        });
    }
};

exports.getAllUserDetails = async (req, res) => {
    try {
      const id = req.user.id;
      const userDetails = await User.findById(id)
        .populate("additionalDetails")
        .exec();
      return res.status(200).json({
        success: true,
        message: "All User deatils Fetched Successfully",
        userDetails,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Issue In Fetching The UserDetails",
        error: err.message,
      });
    }
  };
  

  exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture;
      const userId = req.user.id;
      //console.log("idhar aya ya nhi",userId);
      
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      );
      console.log("image", image);
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      );
      await updatedProfile.save();

      return res.status(200).json({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      });
    } 
    catch (error) {
      return res.status(500).json({
        success: false,
        message:"something went wrong ",

        error:error.message,
      });
    }
  };
  

  exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id;
      console.log("get Enroled course userId...", userId);
      let userDetails = await User.findOne({
        _id: userId,
      }).populate({
          path: "course",
          populate: {
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          },
        })
        .exec()

        userDetails = userDetails.toObject()
        console.log("enrollement course progress..", userDetails);
        var SubsectionLength = 0
        for (var i = 0; i < userDetails.course.length; i++) {
          let totalDurationInSeconds = 0
          SubsectionLength = 0
          for (var j = 0; j < userDetails.course[i].courseContent.length; j++) {
            totalDurationInSeconds += userDetails.course[i].courseContent[
              j
            ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
            userDetails.course[i].totalDuration = convertSecondsToDuration(
              totalDurationInSeconds
            )
            SubsectionLength +=
              userDetails.course[i].courseContent[j].subSection.length
          }
          let courseProgressCount = await CourseProgress.findOne({
            courseID: userDetails.course[i]._id,
            userId: userId,
          })
          courseProgressCount = courseProgressCount?.completedVideos.length
          if (SubsectionLength === 0) {
            userDetails.course[i].progressPercentage = 100
          } else {
            // To make it up to 2 decimal point
            const multiplier = Math.pow(10, 2)
            userDetails.course[i].progressPercentage =
              Math.round(
                (courseProgressCount / SubsectionLength) * 100 * multiplier
              ) / multiplier
          }
        }

        //console.log("enrolled update ke baad ka data..",userDetails);
      
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        });
      }
      return res.status(200).json({
        success: true,
        data: userDetails.course,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  exports.instructorDashboard = async (req, res) => {
    try {
      const courseDetails = await Course.find({ instructor: req.user.id })
  
      const courseData = courseDetails.map((course) => {
        const totalStudentEnrolled = course.studentEnrolled.length
        const totalAmountGenerated = totalStudentEnrolled * course.price
  
        // Create a new object with the additional fields
        const courseDataWithStats = {
          _id: course._id,
          courseName: course.courseName,
          courseDescription: course.courseDescription,
          // Include other course properties as needed
          totalStudentEnrolled,
          totalAmountGenerated,
        }
  
        return courseDataWithStats
      })
  
      res.status(200).json({ courses: courseData })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server Error" });
    }
}
  

