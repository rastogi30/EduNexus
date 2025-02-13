import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import IconBtn from '../../../../common/IconBtn';
import { resetCourseState, setStep } from '../../../../../reducer/slices/courseSlice';
import { COURSE_STATUS } from '../../../../../utils/constants';
import { editCourseDetails } from '../../../../../services/operations/courseDetailsAPI';
import { useNavigate } from 'react-router-dom';

const PublishCourse = () => {
    const {register, handleSubmit, setValue, getValues}= useForm();
    const {course}= useSelector((state)=>state.course);
    const dispatch= useDispatch();
    const navigate=useNavigate();
    const {token}= useSelector((state)=>state.auth);
    const [loading, setLoading]= useState(false);

    useEffect(()=>{
        if(course?.status === COURSE_STATUS.PUBLISHED){
            setValue("public",true);
        }
    },[])

    const goBack=()=>{
        dispatch(setStep(2));
    }

    const goToCourses=()=>{
        dispatch(resetCourseState());
        //navigate to the
        navigate("/dashboard/my-courses");
       
    }

    const handleSubmitPublich= async ()=>{

    if(course?.status === COURSE_STATUS.PUBLISHED && getValues("public")===true ||
     (course.status===COURSE_STATUS.DRAFT && getValues("public")===false) ){
        // no updation in the form
        // no need for the api call
        goToCourses();
        return;
     }

    //  if form data update use h
    const formData= new FormData();
    formData.append("courseId", course._id);
    const courseStatus= getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT;
    formData.append("status", courseStatus);

    //console.log("font mei id chech11...", course._id);
    //console.log("font mei id chechStatus22...", courseStatus);
    

    setLoading(true);
    const result= await editCourseDetails(formData, token );
     //console.log("front end mei updated ke bad kya aya...", result);
    if(result){
        goToCourses();
    }
    setLoading(false);

    }

    const onSubmit = ()=>{
        handleSubmitPublich();
    }

  return (
    <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
            <p className="text-2xl font-semibold text-richblack-5">Publish Course</p>
            <form onSubmit={handleSubmit(onSubmit)}>
             {/* Checkbox */}
                <div className="my-6 mb-8" className="inline-flex items-center text-lg">
                    <label htmlFor='public'>
                    <input type='checkbox'
                        id='public'
                        {...register("public")}
                        className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
                    />
                    <span className="ml-2 text-richblack-400">Make this Course as Public</span>
                    </label>
                </div>

                 {/* Next Prev Button */}
                <div className="ml-auto flex max-w-max items-center gap-x-4">
                    <button disabled={loading}
                     type='button'
                     onClick={goBack}
                     className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
                     >
                        Back
                    </button>
                    <IconBtn disabled={loading} text="Save Changes"/>
                </div>
            </form>
    </div>
  )
}

export default PublishCourse