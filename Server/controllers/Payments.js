const { instance } = require("../config/razorpay");
const User = require("../models/User");
const Course = require("../models/Course");
const mailSender = require("../Utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/courseEnrollmentEmail");
const { paymentSuccessEmail } = require("../mail/paymentSuccessEmail");
const mongoose = require("mongoose");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");

exports.capturePayment = async (req, res) => {
  const { course } = req.body;
  const userId = req.user.id;

  if (!course || course.length === 0) {
    return res.json({
      success: false,
      message: "Please provide Course IDs",
    });
  }

  let totalAmount = 0;

  try {
    // Calculate total amount for all courses
    for (const courseId of course) {
      const courseDetails = await Course.findById(courseId);
      if (!courseDetails) {
        return res.status(200).json({
          success: false,
          message: `Course not found with id: ${courseId}`,
        });
      }

      // Check if user is already enrolled
      const uid = new mongoose.Types.ObjectId(String(userId));
      if (courseDetails.studentEnrolled.includes(uid)) {
        return res.status(200).json({
          success: false,
          message: `You are already enrolled in course: ${courseDetails.courseName}`,
        });
      }

      totalAmount += Number(courseDetails.price);
    }

    console.log("Total Amount in INR:", totalAmount);
    console.log("Total Amount in Paise (sent to Razorpay):", totalAmount * 100);

    // Create Razorpay order for total amount
    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: Math.random(Date.now()).toString(),
    };

    const paymentResponse = await instance.orders.create(options);
    res.json({
      success: true,
      message: paymentResponse,
    });
  } catch (error) {
    console.error("Error in capturePayment:", error);
    return res.status(500).json({
      success: false,
      message: "Could not initiate order",
      error: error.message
    });
  }
};

// verfiy the payment
exports.verfiyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.course;
  const userId = req.user.id;

//   console.log("payemnt verfiy ke liye front end se kya aya1...",razorpay_order_id);
//   console.log("payemnt verfiy ke liye front end se kya aya2...",razorpay_payment_id);
//   console.log("payemnt verfiy ke liye front end se kya aya3...",razorpay_signature);
//   console.log("payemnt verfiy ke liye front end se kya aya4...",courses);
//   console.log("payemnt verfiy ke liye front end se kya aya5...",userId);

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses || !userId
  ) {
    return res.status(200).json({
      success: false,
      message: "Payment Failed",
    });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // enroll krwao student ko
    await enrollStudents(courses, userId, res);
    return res.status(200).json({ success: true, message: "Payment Verified" })
  }

  return res.status(400).json({
    success: false,
    message: "Payment Failed",
  });
};

const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(200).json({
      success: false,
      message: "Please Provide data for courses or UserId",
    });
  }

  for (const courseId of courses) {
    try {
      //  find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        {
          $push: { studentEnrolled: userId },
        },
        { new: true }
      );
      if (!enrolledCourse) {
        return res.status(500).json({
          success: false,
          message: "Failed to Enroll Student in Course",
        });
      }
     // console.log("Updated course after enroll student...", enrolledCourse)


      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      })

      // find the student and add the courses to their list of enrolledCourses
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: { 
            course: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      );

      //console.log("Student data after enrolled..", enrolledStudent);
      // student ko mail send kr do
      const emailResponse= await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled in Course ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
         `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      );
      //console.log("Email sent successfully: ", emailResponse.response)
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
};

exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;
  const userId = req.user.id;

//   console.log("payemnt email mei kya data aya frontend se1..", orderId);
//   console.log("payemnt email mei kya data aya frontend se2.", paymentId);
//   console.log("payemnt email mei kya data aya frontend se3..", amount);
//   console.log("payemnt email mei kya data aya frontend se4..", userId);

  if (!orderId || !paymentId || !amount || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please Provide all the fields",
    });
  }

  try {
    const enrolledStudent = await User.findById(userId);
    await mailSender(
       enrolledStudent.email,
      `Payment Recieved`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );
  } catch (error) {
    //console.log("errorin sending the mail",error);
    return res.status(500).json({
      success: false,
      message: "Could not send email",
    });
  }
};

// ye sahi h pr for single item pr ham ko multiple pr lagana h..
// initiate the order
//    exports.capturePayment = async(req,res) =>{
//     const {courses} = req.body;
//     const userId = req.user.id;
//     if(courses.length === 0){
//         return res.json({
//             success:false,
//             message:"Please provide course Id"
//         });
//     }

//     let total_amount = 0;
//     for(const course_id of courses){
//         let course
//         try{
//             course = await Course.findById(course_id);
//             if(!course){
//                 return res.status(200).json({
//                     success:false,
//                     message:"Could not find the Course"
//                 });
//             }

//             const uid = mongoose.Types.ObjectId(userId);
//             let falg = course.studentEnrolled.includes(uid)
//             console.log("flag ",falg);
//             console.log("UID ",uid);
//             console.log("course",course)

//             if(falg) {
//                 return res.status(200).json({success:false, message:"Student is already Enrolled"});
//             }

//             total_amount += course.price;
//         }
//         catch(error){
//             console.log(error);
//             return res.status(500).json({
//                 success:false,
//                 message:error.message
//             })
//         }
//     }

//     const currency = "INR";
//     const options = {
//         amount: total_amount * 100,
//         currency,
//         receipt: Math.random(Date.now()).toString(),
//     }
//     try{
//         const paymentResponse = await instance.orders.create(options);
//         res.json({
//             success:true,
//             message:paymentResponse,
//         })
//     }
//     catch(error){
//         console.log("error  ",error.message)
//         return res.status(500).json({
//             success:false,
//             message:`Error While Creating Order Of The Payment`
//         })
//     }
//    }

//    // for payment veryfication
//    exports.verifyPayment = async(req,res) =>{
//     const razorpay_order_id = req.body?.razorpay_order_id;
//     const razorpay_payment_id = req.body?.razorpay_payment_id;
//     const razorpay_signature = req.body?.razorpay_signature;
//     const courses = req.body?.courses;
//     const userId = req.user.id;
//     const uid = ObjectId(userId);

//     if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || ! userId){
//         return res.status(200).json({
//             success:false,
//             message:"Payment Failes"
//         })
//     }
//     let body = razorpay_order_id + "|" + razorpay_payment_id;

//     const expectedSignature = crypto.createHmac("sha256",process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex");

//     if(expectedSignature === razorpay_signature){
//         // enroll krwao student ko
//         await enrolledStudents(courses,userId,res);
//         return res.status(200).json({
//             success:true,
//             message:"Payment Verified"
//         })
//     }
//     return res.status(500).josn({
//         success:false,
//         message:"Payment Verification"
//     })
//     }

//     const enrolledStudents = async(courses,userId,res) =>{
//         if(!courses || !userId){
//             return res.status(404).json({
//                 success:false,
//                 message:"courses or userId not found"
//             });
//         }

//         for(const courseId of courses){
//             try{
//             // find the course and enroll the student in it
//             const enrolledCourse = await Course.findByIdAndUpdate(courseId,
//                 {$push:{studentEnrolled:userId}},
//                 {new:true},
//             )
//             if(!enrolledCourse){
//                 return res.status(500).json({
//                     success:false,
//                     message:"Course Not Found"
//                 })
//             }

//             const courseProgress = await CourseProgress.create({
//                 courseID:courseId,
//                 userId:userId,
//                 completedVideos:[]
//             })
//             // find the student and add the course to their list of enrolled courses

//             const enrolledStudent = await User.findByIdAndUpdate(userId,
//                 {$push:{
//                     courses:courseId,
//                     courseProgress:courseProgress._id,
//                 }},{new:true}
//             )

//             // student ko mail send krdo
//             const emailResponce = await mailSender(
//                 enrolledStudent.email,
//                 `Successfully Enrolled into ${enrolledCourse.courseName}`,
//                 courseEnrollmentEmail(enrolledCourse.courseName,`${enrolledStudent.firstName} " " ${enrolledStudent.lastName}`)
//             )
//             console.log("Email Sent Successfully ",emailResponce);
//             }
//             catch(error){
//                 console.log(error);
//                 return res.status(500).json({
//                     success:false,
//                     message:error.message,
//                 })
//             }
//         }
//     }

//     exports.sendPaymentSuccessEmail = async(req,res) =>{
//         const {orderId,paymentId,amount} = req.body;
//         const userId = req.user.id;
//         if(!orderId || !paymentId || !amount || !userId){
//             return res.status(400).json({
//                 success:false,
//                 message:"Please Provide all the fields"
//             })
//         }

//         try{
//             const enrolledStudent = await User.findById(userId);
//             await mailSender(
//                 enrolledStudent.email,
//                 `Payment Recieved`,
//                 paymentSuccessEmail(`${enrolledStudent.firstName}`,amount/100,orderId,paymentId),
//             )
//         }
//         catch(error){
//             console.log(error);
//             return res.status(500).json({
//                 success:false,
//                 message:"Could not send email"
//             })
//         }
//     }

// const { default: mongoose } = require("mongoose");
// const {instance}= require("../config/razorpay");
// const Course= require("../models/Course");
// const User= require("../models/User");
// const mailSender= require("../Utils/mailSender");

// // ye wala code likh nhi h abhi
// //const {courseEnrollmentEmail}= require("../mail/template/courseEnrollmentEmail");

// // capture the payment and initiate the razorpay order
// exports.capturePayment = async (req, res) => {
//     try{
//         // get course id and user id
//         const {courseId}= req.body;
//         const userId= req.user.id;
//         // validation
//         // valid courseId
//         if(!courseId) {
//             return res.status(400).json({
//                 success:false,
//                 message: "Course id is required",
//             });
//         }
//         // valid cousreDetails
//         let course;
//         try{
//             course= await Course.findById(courseId);
//             if(!course){
//                 return res.status(400).json({
//                     success:false,
//                     message: "could not find the course",
//                 });
//             }
//             // user already pay for the course
//            const uid= new mongoose.Types.ObjectId(userId);
//            if(course.studentsEnrolled.includes(uid)){
//               return res.status(400).json({
//                 success:false,
//                 message: "You have already enrolled for this course",
//               })
//            }

//         }
//         catch(error){
//             console.log(error);
//             return res.status(500).json({
//                 success:false,
//                 error:error.message,
//             });

//         }

//         // order create
//         const amount= course.price;
//         const currency= "INR";

//         const options={
//              amount:amount*100,
//              currency:currency,
//              receipt: Math.random(Date.now()).toString(),
//              notes:{
//                 courseId,
//                 userId,
//              }
//         };

//         try{
//             // initiate the payment using razorpay
//             const paymentResponse= await instance.orders.create(options);
//             console.log(paymentResponse);

//             // return response
//             return res.status(200).json({
//                 success:true,
//                 courseName:course.courseName,
//                 courseDescription:course.courseDescription,
//                 thumbnail:course.thumbnail,
//                 orderId:paymentResponse.id,
//                 currency:paymentResponse.currency,
//                 amount:paymentResponse.amount,
//             });

//         }
//         catch(error){
//             console.log(error);
//             return res.status(500).json({
//                 success:false,
//                 error:error.message,
//             })

//         }
//     }
//     catch(error){
//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             error:error.message,
//         });

//     }
// }

// // verify signature of razorpay and server
// exports.verifySignature = async (req,res)=>{
//     try{
//         const webhookSecret="123456789";

//         const signature = req.headers["x-razorpay-signature"];

//         const shasum= crypto.createHmac("sha256", webhookSecret);
//         shasum.update(JSON.stringify(req.body));
//         const digest= shasum.digest("hex");

//         if(signature==digest){
//             console.log("payment is Authorised");

//             const {courseId, userId}= req.body.payload.payment.entity.notes;

//             try{
//                 // fullfill the action

//                 // find the course and enroll the student in it
//                 const enrolledCourse = await Course.findByIdAndUpdate(
//                                                                 {_id.courseId},
//                                                                 {$push:{studentsEnrolled:userId}},
//                                                                 {new:true},
//                                                                 );

//                 if(!enrolledCourse){
//                     return res.status(500).json({
//                         success:false,
//                         message:'curse is not found',
//                     });
//                 }
//                 console.log(enrolledCourse);

//                 // find the student and add the course to their list enrolled courses
//                 const enrollledStudent = await User.findByIdAndUpdate({_id:userId},
//                                                                     {$push:{courses:courseId}},
//                                                                     {new:true},
//                 );

//                 console.log(enrollledStudent);

//                 // confirmation wala mail send kar do
//                 // pura nhi likha h..baad mei
//                 const mailResponse= await mailSender();

//                 return res.status(200).json({
//                     success:true,
//                     message:'signature verification and course enrolled successfully',
//                 });
//             }
//             catch(error){
//                 console.log(error);
//                 return res.status(500).json({
//                 success:false,
//                 error:error.message,
//                 });
//             }

//         }

//         else{
//             return res.status(400).json({
//                 success:false,
//                 message:'Invalid signature',
//             });

//         }

//     }
//     catch(error){
//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             error:error.message,
//         });
//     }
// };
