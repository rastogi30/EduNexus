const Category=require("../models/Category");
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }

// create tag ka handler function
exports.createCategory= async(req,res)=>{
    try{
        // fetch data
        const {name, description}= req.body;

        // validation
        if(!name || !description){
            return res.status(400),json({
                success:false,
                message: "Please fill all fields",
            });
        }
        // create entry in db
        const tagDetails= await Category.create({
            name:name,
            description:description,
        });
        //console.log(tagDetails);

        // return response
        return res.status(200).json({
            success:true,
            message:'category created successfully',
        });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"category is not created",
            error:error.message,
        });
    }
};

// getsAllCategory handler function
exports.getsAllCategory= async(req,res)=>{
    try{
        const allTags=await Category.find();
        return res.status(200).json({
            success:true,
            message: "All tags fetched successfully",
            data:allTags,
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
             message:"Unable To Fetch All Category Details",
        });
    }
}

// Category page Deatils
exports.categoryPageDetails = async (req,res)=>{
    try{
        const {categoryId}= req.body;
        //console.log("printing category id :", categoryId);

        // find the course for the specific id
        const selectedCategoryCourse = await Category.findById(categoryId)
        .populate({
            path:"course",
            match:{
                status:"Published"
            },
            populate:"ratingAndReviews"
        })
        .exec()
        //console.log("printing selected category course :", selectedCategoryCourse);

        // case when category is not found
        if(!selectedCategoryCourse){
            console.log("category is not found");
            return res.status(404).json({
                success:false,
                message:"Category Not Found",
            });
        }

        // now case when there is no course of such category
        // if(selectedCategoryCourse.course?.length==0){
        //     console.log("No course found for the selected category");
        //     return res.status(404).json({
        //         success: false,
        //         message: "No courses found for the selected category.",
        //       });
        // }

        // comment this if some one select category jis ka course nhi h to upder error show nhi kare....
        // other course jaye to particuler mei no course found and brought freqentfly wale show ho bas...

            // Get courses for other categories
            const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
            })
            let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
            ._id
            )
            .populate({
            path: "course",
            match: { status: "Published" },
            })
            .exec()
           // console.log("Different COURSE", differentCategory);

            // Get top-selling courses across all categories
            const allCategories = await Category.find()
            .populate({
                path: "course",
                match: { status: "Published" },
                populate: {
                path: "instructor",
                },
            })
            .exec()
            //console.log("All Categories : ",allCategories);
            const allCourses = allCategories.flatMap((category) => category.course)
            const mostSellingCourses = allCourses
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10)
             //console.log("mostSellingCourses COURSE", mostSellingCourses)
            res.status(200).json({
            success: true,
            data: {
                selectedCategory:selectedCategoryCourse,
                differentCategory,
                mostSellingCourses,
            },
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });

    }
}

