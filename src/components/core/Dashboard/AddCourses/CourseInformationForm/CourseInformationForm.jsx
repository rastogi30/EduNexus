import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { addCourseDetails, editCourseDetails, fetchCourseCategories } from '../../../../../services/operations/courseDetailsAPI';
import { useEffect } from 'react';
import { HiOutlineCurrencyRupee } from 'react-icons/hi2';
import RequirementField from './RequirementField';
import IconBtn from "../../../../common/IconBtn";
import { setCourse, setStep } from "../../../../../reducer/slices/courseSlice"
import {COURSE_STATUS} from "../../../../../utils/constants"
import { toast } from 'react-hot-toast';
import Upload from "../Upload"
import ChipInput from "./ChipInput"
import {MdNavigateNext} from "react-icons/md"

const CourseInformationForm = () => {

    const{
        register,
        handleSubmit,
        setValue,
        getValues,
        formState:{errors},

    }=useForm();

    const dispatch= useDispatch();
    const {token}=useSelector((state)=>state.auth);
    const {course, editCourse}= useSelector((state)=>state.course);
    const [loading, setLoading]= useState(false);
    const[courseCategories, setCourseCategories]= useState([]);

    useEffect(() =>{

        const getCategories = async()=>{
            setLoading(true);
            const categories= await fetchCourseCategories();
           // console.log("categories---front>",categories)
            if(categories.length>0){
                setCourseCategories(categories);
            }
            
            setLoading(false);
        };

        // chech ki setCourseCategories data set kr raha h ya nhii..
        // useEffect(() => {
        //     console.log("Updated courseCategories:", courseCategories);
        //   }, [courseCategories]);
       

        // if form is in edit mode
        if (editCourse) {
            //console.log("data populated", editCourse)
            setValue("courseTitle", course.courseName)
            setValue("courseShortDes", course.courseDescription)
            setValue("coursePrice", course.price)
            setValue("courseTags", course.tag)
            setValue("courseBenefits", course.whatYouWillLearn)
            setValue("courseCategory", course.category)
            setValue("courseRequirements", course.instructions)
            setValue("courseImage", course.thumbnail)
        }
        getCategories()
    },[])

    const isFormUpdated = ()=>{
        const currentValues= getValues();
       //console.log("changes after editing form values:", currentValues)
        if( currentValues.courseTitle !== course.courseName ||
            currentValues.courseShortDes !== course.courseDescription ||
            currentValues.coursePrice !== course.price ||
            currentValues.courseTags.toString() !== course.tag.toString() ||
            currentValues.courseBenefits !== course.whatYouWillLearn ||
            currentValues.courseCategory._id !== course.category._id ||
            currentValues.courseRequirements.toString() !==
            course.instructions.toString() ||
            currentValues.courseImage !== course.thumbnail
        ){
            return true;
        }
        else return false;
    }

    // handle the next button click 
    const onSubmit= async (data)=>{
        //console.log("data aa raha h ya nhi...", data);
        if(editCourse){
            if(isFormUpdated()){
                const currentValues= getValues();
                console.log("edit mei aa raha..", currentValues)
            const formData= new FormData();

            formData.append("courseId", course._id);
            if(currentValues.courseTitle !== course.courseName){
                formData.append("courseName", data.courseTitle);
            }
            if(currentValues.courseShortDes!== course.courseDescription){
                formData.append("courseDescription", data.courseShortDes);
            }
            if(currentValues.coursePrice !== course.price){
                formData.append("price", data.coursePrice);
            }
            if (currentValues.courseTags.toString() !== course.tag.toString()) {
                formData.append("tag", JSON.stringify(data.courseTags))
              }
            if(currentValues.courseBenefits !== course.whatYouWillLearn){
                formData.append("whatYouWillLearn", data.courseBenefits);
            }
            if(currentValues.courseCategory._id !== course.category._id){
                formData.append("category", data.courseCategory);
            }
            if(currentValues.courseRequirements.toString() !== course.instructions.toString()){
                formData.append("instructions", JSON.stringify(data.courseRequirements));
            }
            if (currentValues.courseImage !== course.thumbnail) {
                formData.append("thumbnailImage", data.courseImage)
              }

            setLoading(true);
            const result= await editCourseDetails(formData, token );
            setLoading(false);
            if(result){
                dispatch(setStep(2));
                dispatch(setCourse(result));
            }

          //  console.log("printing formData", formData);
            console.log("printing the result ", result);
        }

        else{
            toast.error("No change made to the form")
        }
        return;
        }

        // if come to create the new course
        const formData= new FormData();
        formData.append("courseName", data.courseTitle);
        //console.log("here form data...1", data.courseTitle);

        formData.append("courseDescription", data.courseShortDes);
        //console.log("here form data...1", data.courseShortDes);

        formData.append("price", data.coursePrice);
       // console.log("here form data...1", data.coursePrice);

        formData.append("tag", JSON.stringify(data.courseTags))
        formData.append("whatYouWillLearn", data.courseBenefits);
        formData.append("category", data.courseCategory);
        formData.append("instructions", JSON.stringify(data.courseRequirements));
        formData.append("status", COURSE_STATUS.DRAFT)
        formData.append("thumbnailImage", data.courseImage)

       setLoading(true);
            const result= await addCourseDetails(formData, token );
            if(result){
                dispatch(setStep(2));
                dispatch(setCourse(result));
            }
            setLoading(false);
       //console.log("printing formData", formData);
    //    formData.forEach((value, key) => {
    //     console.log("aa raha h ya nhi...",`${key}: ${value}`);
    //   });
      // console.log("printing the result ", result);
    }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      
      {/* Course Title */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor='courseTitle'>
        Course Title <sup className="text-pink-200">*</sup></label>
        <input
            id='courseTitle'
            placeholder='Enter the Course Title'
            {...register("courseTitle", {required:true})}
            className="form-style w-full"
        />
        {
            errors.courseTitle && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                Course title is Required </span>
            )
        }
      </div>

      {/* Course Short Description */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor='courseShortDes'>
         Course Short Description<sub className="text-pink-200">*</sub></label>
        <textarea 
            id='courseShortDes'
            placeholder='Enter the Course Description '
            {...register("courseShortDes", {required:true})}
            className='form-style resize-x-none min-h-[130px] w-full'
        />
        {
            errors.courseShortDes && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                Course Description is Required </span>
            )
        }
      </div>

      {/* Course Price */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor='coursePrice'>
         Course Price <sup className="text-pink-200">*</sup></label>
         <div className="relative">
         <input
            id='coursePrice'
            placeholder='Enter the Course Price'
            {...register("coursePrice", {required:true, valueAsNumber:true,
                                                        pattern: {
                                                        value: /^(0|[1-9]\d*)(\.\d+)?$/,},}
                                                     )}
            className="form-style w-full !pl-12"
        />
        <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400"/>
        </div>
        {errors.coursePrice && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Price is required
          </span>
        )}
      </div>

        {/* Course Category */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor='courseCategory'>
        Course Category<sup className="text-pink-200">*</sup></label>
        <select id='courseCategory'
        defaultValue=""
        {...register("courseCategory",{required:true})}
        className="form-style w-full">
            <option value="" disabled>Choose a Category</option>
            {
                !loading && courseCategories.map((category, index) =>(
                    <option key={index} value={category?._id}>
                    {category?.name}
                    </option>
                ))}
        </select>
        {
            errors.courseCategory && (
                <span  className="ml-2 text-xs tracking-wide text-pink-200">
                Course Category is Required </span>
            )
        }
      </div>

      {/* create a custom componennts to handle the tags */}
      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Tags and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />

      {/* anoth components for the thumbnail uploading and preview */}
      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      /> 


      {/* benefits of the courses */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
         Benefits of the Courses<sup className="text-pink-200">*</sup></label>
        <textarea
            id='courseBenefits'
            placeholder='Enter the Benefits of the courses'
            {...register("courseBenefits", {required:true})}
            className="form-style resize-x-none min-h-[130px] w-full"
        />
      
      {
        errors.courseBenefits && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                 Benefits of the course is required</span>
            )
        }
        </div>

        {/* Requirements/Instructions */}
        <RequirementField
            name='courseRequirements'
            label="Requirements/Instructions"
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
        />

        {/* Next Button */}
        <div className="flex justify-end gap-x-2">
            {
                editCourse && (
                    <button onClick={()=>dispatch(setStep(2))}
                    disabled={loading}
                    className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}>
                        Continue without Saving 
                    </button>
                )
            }
            <IconBtn
          disabled={loading}
          text={!editCourse ? "Next" : "Save Changes"}>
           <MdNavigateNext />
        </IconBtn>
        </div>
    </form>
  )
}

export default CourseInformationForm