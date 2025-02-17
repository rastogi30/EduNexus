const Course= require("../models/Course");
const Category= require("../models/Category");
const User= require("../models/User");
const {uploadImageToCloudinary}=require("../Utils/imageUploader");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");
const { convertSecondsToDuration } = require("../Utils/secondToDuration");
require("dotenv").config();

// create Course handler function
exports.createCourse = async(req,res)=>{
    try{
        //console.log("Backend mei aa gaye h...")
        // get the user id
        const userId = req.user.id;
      // console.log("user ki id--->",userId)

        // fetch other require data fields
        let {courseName, courseDescription,whatYouWillLearn, price,
               tag:_tag, 
               category, status, 
               instructions:_instructions,
              }=req.body;
              
            //console.log("data is fetched...")
        // get thumbnail
         const thumbnail=req.files.thumbnailImage;
         //console.log("coursename-->",thumbnail)

        // Convert the tag and instructions from stringified Array to Array
        const tag = JSON.parse(_tag)
        const instructions = JSON.parse(_instructions)

          // console.log("parsed tag", tag);
          // console.log("parsed instruction", instructions);
          // console.log("coursename--1>",courseName)
          //     console.log("coursename--2>",courseDescription)
          //     console.log("coursename--3>",whatYouWillLearn)
          //     console.log("coursename--4>",price)
          //     console.log("coursename--5>",category)
          //     console.log("coursename--6>",tag)
          //     console.log("coursename--7>",instructions)
          
        // validation
      if(!courseName || !courseDescription || !whatYouWillLearn || !price ||
           !thumbnail ||
          !category || !tag.length || !instructions.length )
        {
            return res.status(400).json({
                success:false,
                message: "Please fill in all fields",
            });
        }
        if (!status || status === undefined) {
            status = "Draft";
          }

        // Check if the user is an instructor
        const instructorDetails = await User.findById(userId, {
            accountType: "Instructor",
        });

        console.log("Instructor Details---->", instructorDetails)
    
        if (!instructorDetails) {
            return res.status(404).json({
            success: false,
            message: "Instructor Details Not Found",
            });
        }

        // check given tag is valid or not
        //console.log(category);
        const categoryDetails= await Category.findById(category);
       // console.log("idhar h", categoryDetails)
        if(!categoryDetails){
            return res.status(404).json({
                success:false,
                message: "category deatils not found",
            });
        }

        // upload thumbnail image to clouidnary
         const thumbnailImage= await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        // create an entry for new course with the given details 
        const newCourse= await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            price,
            tag:tag,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
            status:status,
            instructions:instructions,
        })
       console.log("backen....course", newCourse);
        // add new course to the user schema of instructor
        await User.findByIdAndUpdate(
             {_id:instructorDetails._id},
            {
                $push:{course:newCourse._id}
            },
            {new:true},
        );

        // add this new  course to the category
        console.log("new course ki id aa rahi h ya nhi..",newCourse._id);
        console.log("category mei kya aa raha h.",category);
        const categoriesNew= await Category.findByIdAndUpdate(
          {_id:category},
           {
               $push:{course:newCourse._id}
           },
           {new:true},
       );
       console.log(":-> backend mei categries data after push.... ", categoriesNew);


        // return the successfull response 
        return res.status(200).json({
            success:true,
            message: "Course created successfully",
            data:newCourse,
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Error creating course",
            error:error.message,
        });
    }
};


// getAllcourses handler function
exports.showAllCourses= async (req,res)=>{
    try{
        const allCourses= await Course.find({status:"Published"},{ courseName:true,
                                                 courseDescription:true,
                                                 price:true,
                                                 thumbnail:true,
                                                 instructor:true,
                                                 ratingAndReviews:true,
                                                 studentsEnrolled:true,
         })
         .populate("instructor")
         .exec();

         return res.status(200).json({
            success:true,
            message: "All courses fetched successfully",
            data:allCourses,
         })
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:'Cannot Fetch All Course Data',
            error:error.message,
        });
    }
}

// getCourseDetails handler function
exports.getCourseDetails = async (req,res)=>{
    try{
        // get the course id
        const {courseId}= req.body;

        // find course details
        const courseDetails= await Course.findOne({_id:courseId})
                                            .populate(
                                                {
                                                    path:"instructor",
                                                    populate:{
                                                        path:"additionalDetails",
                                                    },
                                                }
                                            )
                                            .populate("category")
                                            .populate("ratingAndReviews")
                                            .populate({
                                                path:"courseContent",
                                                populate:{
                                                    path:"subSection",
                                                    select: "-videoUrl",
                                                },
                                            })
                                            .exec();
           // console.log("course Details backend mei..",courseDetails);
            // validation
            if(!courseDetails){
                return res.status(404).json({
                    success:false,
                    message:`Could not find the course with the ${courseId}`,
                });
            }

            // return the response
            return res.status(200).json({
                success:true,
                message:`Course details fetched successfully`,
                data:courseDetails,
            });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Not able to fetch course details",
            error:error.message,
        });

    }
};



exports.editCourse = async (req, res) => {
try {
    const { courseId } = req.body
    const updates = req.body
    const course = await Course.findById(courseId)

    // console.log("req body se fetch hua ya nhi...", courseId);
    // console.log("req body se fetch hua ya nhi22...", updates);
    // console.log("req body se fetch hua ya nhi33...", course);

    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update")
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key])
        } else {
          course[key] = updates[key]
        }
      }
    }

    await course.save()

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    //console.log("backend mei update hua ya nhi...", updatedCourse);
    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

// get courses for the given instructor
exports.getInstructorCourses = async (req,res)=>{
    try{
        // fetch the id from the body
        const instructorId = req.user.id;

        // find all courses belong to that instructor
        const instructorCourses= await Course.find({
            instructor: instructorId,
        }).sort({ createdAt: -1 })

        console.log("Backend se kya jaa raha in getInstructorCourses", instructorCourses);
        return res.status(200).json({
            success: true,
            data: instructorCourses,
          })
          

    }
    catch(error){
        console.error(error)
        res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
        });
    }
};

// Delete the course
exports.deleteCourse = async(req,res) =>{
    try{
        // fetch the id from the body
        const {courseId} = req.body;
        // or fetch like this.... const courseId= req.body.courseId since in front end we pass like this...{courseId:courseId} means
        // it become obejct...
        //console.log("courseid in backend...", courseId);

        // find the course
        const course= await Course.findById(courseId)
       // console.log("backend mei course minila...",course);
        if(!course){
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        //unrolled the student from the course
        const studentsEnrolled= course.studentEnrolled;
        for (const studentId of studentsEnrolled) {
            await User.findByIdAndUpdate(studentId, {
              $pull: { course: courseId },
            })
          }
          //console.log("backend mei user minila...",User);

        // delete the section and sub section
        const courseSections = course.courseContent
        for (const sectionId of courseSections) {
            // Delete sub-sections of the section
            const section = await Section.findById(sectionId)
            if (section) {
              const subSections = section.subSection
              for (const subSectionId of subSections) {
                await SubSection.findByIdAndDelete(subSectionId)
              }
            }
      
            // Delete the section
            await Section.findByIdAndDelete(sectionId)
          }
      
          // Delete the course
          await Course.findByIdAndDelete(courseId)
      
          return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
          })
        } catch (error) {
          console.error(error)
          return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

// get fullCourseDetails
exports.getFullCourseDetails = async (req,res) =>{
    try {
        const {courseId}= req.body;
        const userId= req.user.id;
        const courseDetails= await Course.findOne({_id:courseId})
        .populate({
            path: "instructor",
            populate: {
              path: "additionalDetails",
            },
          })
          .populate("category")
          .populate("ratingAndReviews")
          .populate({
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          })
          .exec()

        let courseProgressCount = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId,
        });

        console.log("courseDetails in backend..", courseDetails);
        console.log("courseDetails courseContent in backend..",courseDetails.courseContent);
        console.log("courseDetails me courseConntent backend..", courseDetails.courseContent.subSection);
        console.log("courseProgressCount in backend..", courseProgressCount);

        if (!courseDetails) {
          return res.status(400).json({
            success: false,
            message: `Could not find course with id: ${courseId}`,
          })
        }


        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
    console.log("backend mei total time..",totalDuration);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}