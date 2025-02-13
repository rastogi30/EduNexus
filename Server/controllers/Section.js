const Section= require("../models/Section");
const Course= require("../models/Course");
const SubSection= require("../models/SubSection");

// create section
exports.createSection= async (req, res)=>{
    try{
        // data fetch 
        const {sectionName , courseId } = req.body;

        // validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message: "Please fill all the fields"
            });
        }
        // create section
        const newSection = await Section.create({sectionName});

        // update the course with obkectID.....Add the new section to the course's content array
        const updatedCourse = await Course.findByIdAndUpdate( courseId,
                                                              {
                                                                $push: 
                                                                   {
                                                                    courseContent: newSection._id
                                                                    }
                                                              },
                                                            {new:true},
                                                          )
                                                          .populate({
                                                            path: "courseContent",
                                                            populate:({
                                                                path: "subSection",
                                                            }),
                                                        })
                                                        .exec();
        //console.log("backend...section", updatedCourse);

        // Return the updated course object in the response
        return res.status(200).json({
            success:true,
            message: "Section created successfully",
            updatedCourse,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'something went wrong in creating the section',
            error:error.message,
        });
    }
}

// update section
exports.updateSection = async (req, res) => {
    try{
        // data fetch
        const {sectionId, sectionName, courseId} = req.body;
        // console.log("update ke liye check data..", req.body);
        // console.log("sectionId..", sectionId);
        // console.log("sectionId..", sectionName);
        // console.log("sectionId..", courseId);

        // validation
        if(!sectionId || !sectionName){
            return res.status(400).json({
                success:false,
                message: "Please fill all the fields"
            });
        }

        // update the data
        const section = await Section.findByIdAndUpdate(sectionId, { sectionName:sectionName }, {new:true} );
        //console.log("section ka dta nhi aa raha..", section);
        if (!section) {
            return res.status(404).json({
                success: false,
                message: 'Section not found',
            });
            // console.log("section ka dta nhi aa raha..", section);
        }

        const course = await Course.findById(courseId)
		.populate({
			path:"courseContent",
			populate:{
				path:"subSection"
			},
		}).exec()
        console.log("delete ke baad data..", course);
        //console.log("backend mei update hua ya nhi..", course);

        // return the response
        return res.status(200).json({
            success:true,
            message:section,
            data : course,
        });
        
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'something went wrong in updating the section',
            error:error.message,
        });
    }
}

// delete section
exports.deleteSection = async (req, res) => {
    try{
        // get Id =assuming we send id in params
        const {sectionId, courseId}= req.body;
        //console.log("backend for delete..", sectionId, courseId);

        // find by ID and Delete
        await Course.findByIdAndUpdate(courseId,{
                                                     $pull:{
                                                        courseContent:sectionId,
                                                     }})
                                                     
        const section = await Section.findById(sectionId);
		//console.log("section mei kya aya..", section);
		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
            //console.log("idhar section aya hi nhi..");
		}

		// Delete the associated subsections
		await SubSection.deleteMany({_id: {$in: Section.subSection}});

		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();
        //console.log("delete ke baad backend mei kya aya..", course);
        // return the response
        return res.status(200).json({
            success:true,
            message: "Section delete successfully",
            data:course,
        });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'something went wrong in deleting the section',
            error:error.message,
        });
    }
}
