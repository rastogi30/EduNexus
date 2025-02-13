import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../reducer/slices/viewCoursesSlice';
import {getFullDetailsOfCourse} from "../services/operations/courseDetailsAPI";
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal';
import VideoDetailsSidebar from '../components/core/ViewCourse/VideoDetailsSidebar';



const ViewCourses = () => {

    const [reviewModal, setReviewModal]= useState(false);
    const {courseId}= useParams();
    const {token}= useSelector((state)=> state.auth);
    const dispatch = useDispatch();
    //const {courseSectionData} =useSelector((state)=>state.viewCourse)

    useEffect(() => {
      ;(async () => {
        const courseData = await getFullDetailsOfCourse(courseId, token)
        // console.log("Course Data here... ", courseData.courseDetails)
        dispatch(setCourseSectionData(courseData.courseDetails?.courseContent))
        dispatch(setEntireCourseData(courseData?.courseDetails))
        dispatch(setCompletedLectures(courseData?.completedVideos))
        let lectures = 0
        courseData?.courseDetails?.courseContent?.forEach((sec) => {
          lectures += sec.subSection.length
        })
        dispatch(setTotalNoOfLectures(lectures))
      })()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  //   useEffect(() => {
  //     //console.log("Redux state updated in ViewCourses", courseSectionData);
  // }, [courseSectionData]);
   

  return (
    <>
      <div className="relative flex flex-col md:flex-row min-h-[calc(100vh-3.5rem)]">
        {/* Sidebar with responsive behavior */}
        <div className="md:w-[320px] w-full md:min-h-[calc(100vh-3.5rem)] border-r-[1px] border-r-richblack-700 bg-richblack-800">
          <VideoDetailsSidebar setReviewModal={setReviewModal} />
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-auto bg-richblack-900">
          <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 lg:px-8">
            <Outlet />
          </div>
        </div>
      </div>

      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  )
}

export default ViewCourses