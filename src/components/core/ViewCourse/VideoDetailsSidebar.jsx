import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import IconBtn from '../../common/IconBtn';
import { useState } from 'react';
import { BsChevronDown } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"


const VideoDetailsSidebar = ({setReviewModal}) => {

    const [activeStatus, setActiveStatus]= useState("");
    const [videoBarActive, setVideoBarActive]= useState("");
    const navigate= useNavigate();
    const location= useLocation();

    const {sectionId , subSectionId}= useParams();

    const {
        courseSectionData,
        courseEntireData,
        totalNoOfLectures,
        completedLectures,
      } = useSelector((state) => state.viewCourse)

    //   console.log("video details sidebar..1", courseSectionData);
    //   console.log("video details sidebar..2", courseEntireData);
    //   console.log("video details sidebar..3", totalNoOfLectures);
    //   console.log("video details sidebar..4", completedLectures);

    // useEffect(() => {
    //     console.log("Active Status:", activeStatus);
    //   }, [activeStatus]);

    useEffect(() => {
        console.log("Updated subSectionId from URL:", subSectionId);
    }, [subSectionId]);
    

   
    useEffect(()=> {

        console.log("subSectionId changed:", subSectionId);

        const setactivevideo=()=>{
            if(!courseSectionData?.length){
                return
            }

            const currentSectionIndex= courseSectionData.findIndex(
                (data)=> data._id ===sectionId
            )
            console.log("current section index..", currentSectionIndex);

            const currentSubSectionIndex= courseSectionData?.[currentSectionIndex]?.subSection.
            findIndex(
                (data)=> data._id===subSectionId
            )
            console.log("current subsection index..",currentSubSectionIndex);

            const activeSubSectionId= courseSectionData[currentSectionIndex]?.subSection?.[currentSubSectionIndex]?._id;
            console.log("current active subsection index..",activeSubSectionId);
            
            // set Current section here
            setActiveStatus(courseSectionData?.[currentSectionIndex]?._id); 
            // set current sub section here
            setVideoBarActive(activeSubSectionId);
            console.log("sidebar activ video konsi h..after ", videoBarActive);
        }
        setactivevideo();
    },[courseSectionData, courseEntireData,location.pathname])

    //console.log("sidebar active section", activeStatus);
    //console.log("sidebar activ video konsi h..", videoBarActive);


  return (
    <div className="flex h-full flex-col bg-richblack-800">
        {/* Header */}
        <div className="flex flex-col gap-4 p-4 border-b border-richblack-700">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate("/dashboard/enrolled-courses")}
                    className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90 transition-all duration-200"
                    title="back"
                >
                    <IoIosArrowBack size={30} />
                </button>

                <IconBtn
                    text="Add Review"
                    customClasses="text-sm"
                    onclick={() => setReviewModal(true)}
                />
            </div>

            <div className="flex flex-col">
                <h2 className="text-lg md:text-xl font-semibold text-richblack-5 line-clamp-2">
                    {courseEntireData?.courseName}
                </h2>
                <p className="text-sm font-medium text-richblack-500">
                    {completedLectures?.length}/{totalNoOfLectures} lectures completed
                </p>
            </div>
        </div>

        {/* Course Sections */}
        <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col">
                {courseSectionData?.map((section, index) => (
                    <div key={section._id} className="border-b border-richblack-700">
                        <button
                            className="w-full px-4 py-4 bg-richblack-700 hover:bg-richblack-600 transition-all duration-200"
                            onClick={() => setActiveStatus(activeStatus === section?._id ? null : section?._id)}
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm md:text-base font-semibold text-richblack-50">
                                    {section?.sectionName}
                                </h3>
                                <span className={`transform transition-transform duration-200 ${
                                    activeStatus === section?._id ? "rotate-180" : ""
                                }`}>
                                    <BsChevronDown className="text-white" />
                                </span>
                            </div>
                        </button>

                        {/* Subsections */}
                        {activeStatus === section?._id && (
                            <div className="bg-richblack-900">
                                {section?.subSection?.map((topic) => (
                                    <button
                                        key={topic._id}
                                        onClick={() => {
                                            navigate(`/view-courses/${courseEntireData?._id}/section/${section?._id}/sub-section/${topic?._id}`)
                                            setVideoBarActive(topic?._id)
                                        }}
                                        className={`flex items-center gap-3 w-full px-4 py-3 transition-all duration-200 ${
                                            videoBarActive === topic?._id
                                                ? "bg-yellow-200 text-richblack-900 font-medium"
                                                : "text-richblack-50 hover:bg-richblack-700"
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={completedLectures.includes(topic?._id)}
                                            onChange={() => {}}
                                            className="rounded-sm border-2 border-richblack-500"
                                        />
                                        <span className="text-sm">{topic?.title}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default VideoDetailsSidebar