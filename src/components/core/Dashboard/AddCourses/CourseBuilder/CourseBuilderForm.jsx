import React, { useState } from 'react'
import IconBtn from '../../../../common/IconBtn';
import { MdAddCircleOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { MdNavigateNext } from "react-icons/md"
import { setStep,setCourse, setEditCourse } from '../../../../../reducer/slices/courseSlice';
import toast from 'react-hot-toast';
import { createSection, updateSection } from '../../../../../services/operations/courseDetailsAPI';
import NestedView from './NestedView';
import { useForm } from 'react-hook-form';


const CourseBuilderForm = () => {
    const {register, handleSubmit, setValue, formState:{errors} }= useForm();
    const [editSectionName, setEditSectionName]= useState(null);

    const {course}= useSelector((state)=>state.course);
    const dispatch= useDispatch();
    const [loading, setLoading]= useState(false);
    const {token}= useSelector((state)=>state.auth);

    // handle form submission
    const onSubmit= async ( data )=>{
        //console.log("idhar aa gaya..1",data)
        setLoading(true);
        let result;

        if(editSectionName){
            // we are editing the section Name
            result= await updateSection(
                {
                    sectionName:data.sectionName,
                    sectionId:editSectionName,
                    courseId:course._id,
                },token
            )
          //  console.log("edit ke baad ka data..", result)
        }
        else{
            result= await createSection({
                sectionName:data.sectionName,
                courseId:course._id,
            }, token)
        }
        //console.log("result front end...", result);

        // update values
        if(result){
           // console.log("section result", result)
            dispatch(setCourse(result));
           // console.log("Updated Course State:", result);
            setEditSectionName(null);
            setValue("sectionName","");
        }
        console.log("result front end222...", result);

        // loading false
        setLoading(false);
    }

    const cancelEdit=()=>{
        setEditSectionName(null);
        setValue("sectionName", "");
    }

    const goBack= ()=>{
        dispatch(setStep(1));
        dispatch(setEditCourse(true));
    }
    const goToNext=()=>{
     //console.log("cousrse ki length and next pr ne pr...", course.courseContent);
        if(course.courseContent.length===0){
            toast.error("Please add at least one Section");
            return;
        }
        if(course.courseContent.some((section)=> section.subSection.length === 0)){
            toast.error("Please add at least one lecture in each Section ");
            return;
        }
        // if everything is corrrect
        dispatch(setStep(3));
    }

    const handleChangedEditSectionName=(sectionId, sectionName)=>{

        if(editSectionName === sectionId){
            cancelEdit();
            return;
        }
        setEditSectionName(sectionId);
        setValue("sectionName", sectionName)
    }


  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
    <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor='sectionName'>Section Names
                                                                      <sup className="text-pink-200">*</sup></label>
            <input
                id='sectionName'
                disabled={loading}
                name='sectionName'
                placeholder="Add a section to build your course"
                {...register("sectionName", {required:true})}
               className="form-style w-full"
            />
            {
                errors.sectionName && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">Section Name is required</span>
                )
            }
        </div>
        <div className="flex items-end gap-x-4" >
            <IconBtn type="submit"
              disabled={loading}
             text={ editSectionName ? "Edit Section Name" : "Create Section"}
             outline={true}>
                <MdAddCircleOutline className='text-yellow-50' size={20}/>
            </IconBtn>
            
                {editSectionName && (
                    <button type='button'
                    onClick={cancelEdit}
                    className='text-sm text-richblack-300 underline'>
                        Cancel Edit
                    </button>
                )}
        </div>
    </form>
    {
        course.courseContent?.length>0 && (
            <NestedView  handleChangedEditSectionName={handleChangedEditSectionName} />
        )
    }

    {/* Next Prev Button */}
    <div className="flex justify-end gap-x-3">
    <button onClick={goBack}
     className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}>
        Back
    </button>
    <IconBtn disabled={loading} text="Next" onclick={goToNext}>
        <MdNavigateNext/>
    </IconBtn>

    </div>
    </div>
  )
}

export default CourseBuilderForm