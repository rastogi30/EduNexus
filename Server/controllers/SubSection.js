const SubSection= require("../models/SubSection");
const Section= require("../models/Section");
const { uploadImageToCloudinary } = require("../Utils/imageUploader");

// Create a new sub-section for a given section
exports.createSubSection = async (req,res)=>{
    try{
        // fetch the data
        const {sectionId, title, description}= req.body;

        // extract file/video
        const video= req.files.video;
        // console.log(video)

        // console.log(" section Id..",sectionId);
        // console.log("title...",title);
        // console.log("description..",description);
        // console.log("video...",video);
        // validation
        if(!sectionId || !title || !description || !video){
            return res.status(400).json({
                success:false,
                message: "Please fill all the fields",
            });
        }
        // upload video to cloudinary
        const uploadDetails= await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
         console.log("video upload ke baad us ka data...",uploadDetails);
         console.log("Duration received from Cloudinary:", uploadDetails.duration);


        // create a sub section
        const SubSectionDetails  = await SubSection.create({
            title:title,
            timeDuration: `${uploadDetails.duration}`,
            description:description,
            videoUrl:uploadDetails.secure_url,
        })

        console.log("subsection mei kya aya...", SubSectionDetails);
        
        // update the section with this sub section objectID
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
                                                               {
                                                                $push:{
                                                                    subSection:SubSectionDetails._id,
                                                                }
                                                               },
                                                               {new:true},
                                                              ).populate("subSection").exec();
        
        // Return the updated section in the response
        console.log("update ke baad section mei kya aya...", updatedSection);
        return res.status(200).json({
            success:true,
            message:'Sub-Section created successfully',
            data:updatedSection,
        });
  

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'something went wrong in creating the Sub-Section',
            error:error.message,
        });

    }
};

// update subsection
exports.updateSubSection = async (req,res)=>{
    try{
        // fetch the data
        const {subSectionId, sectionId, title, description}= req.body;
        const subSection = await SubSection.findById(subSectionId);

        //validation
        if(!subSection){
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
              })
        }

        if (title !== undefined) {
            subSection.title = title
        }
      
        if (description !== undefined) {
            subSection.description = description
          }

        if (req.files && req.files.video !== undefined) {
            const video = req.files.video
            const uploadDetails = await uploadImageToCloudinary(
              video,
              process.env.FOLDER_NAME
            )
            subSection.videoUrl = uploadDetails.secure_url
            subSection.timeDuration = `${uploadDetails.duration}`
        }
      
         await subSection.save()
      
         // find updated section and return it
        const updatedSection = await Section.findById(sectionId).populate("subSection").exec();
        
        console.log("updated Sub Section", updatedSection)
    
        return res.json({
            success: true,
            data:updatedSection,
            message: "Section updated successfully",
          });
        } 
        
        catch (error) {
          console.error(error)
          return res.status(500).json({
            success: false,
            message: "An error occurred while updating the section",
        });
    }
}


//delete Subsection
exports.deleteSubSection = async (req,res)=>{
    try{
        const {subSectionId, sectionId} = req.body;

        await Section.findByIdAndUpdate({_id:sectionId},
                                        {
                                           $pull:{
                                                subSection:subSectionId
                                            },
                                        },
                                        {new:true},
                                        );
        
        const subSection= await SubSection.findByIdAndDelete({_id:subSectionId})
        //console.log("backend...subSection..",subSection);
        if(!subSection){
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            });
        }

        // find updated section and return it
        const updatedSection = await Section.findById(sectionId).populate("subSection").exec();
        //console.log("After delete kya kya bacha", updatedSection);
        return res.json({
          success: true,
          data:updatedSection,
          message: "SubSection deleted successfully",
          data:updatedSection,
        });

    }
    catch(error){
        console.error(error)
        return res.status(500).json({
          success: false,
          message: "An error occurred while deleting the SubSection",
        });
      }
    }