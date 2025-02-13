import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Player } from 'video-react';
import {AiFillPlayCircle} from "react-icons/ai"
import IconBtn from '../../common/IconBtn';
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../reducer/slices/viewCoursesSlice"
import "video-react/dist/video-react.css"
import { PlaybackRateMenuButton, ControlBar } from "video-react";

const VideoDetails = () => {

    const { courseId, sectionId, subSectionId } = useParams()
    const navigate= useNavigate();
    const dispatch= useDispatch();
    const location = useLocation();
    const playerRef = useRef();
    const {token}= useSelector((state)=>state.auth);

    const {courseSectionData, courseEntireData, completedLectures}=useSelector((state)=>state.viewCourse);
    const [videoData, setVideoData]= useState(null);
    const [previewSource, setPreviewSource] = useState("")
    const [videoEnded, setVideoEnded]= useState(false);
    const [loading, setLoading]= useState(false);

    // first render mei konsi video open us ka function
    useEffect(()=>{
        const setVideoSpecificDetails = async()=>{
            if(!courseSectionData && courseSectionData?.length ===0){
                return;
            }

            if(!courseId && sectionId && subSectionId){
                navigate("/dashboard/enrolled-courses");
            }
            else{
                // means sara data present h 
                const filteredData = courseSectionData.filter(
                    (course) => course._id === sectionId
                  )

                   console.log("filteredData...sectionData", filteredData)
                  const filteredVideoData = filteredData[0]?.subSection?.find(
                    (data) => data._id === subSectionId
                  )
                   console.log("filteredVideoData...video Subsection..", filteredVideoData)
                  setVideoData(filteredVideoData)
                  setPreviewSource(courseEntireData?.thumbnail)
                  setVideoEnded(false)
            }
        }
        setVideoSpecificDetails();
    },[courseSectionData, courseEntireData, location.pathname])

    const isFirstVideo = ()=>{
        const currentSectionIndex= courseSectionData.findIndex(
            (data)=>data._id===sectionId
        )

        const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subSection?.findIndex(
            (data)=> data._id===subSectionId
        )

        if(currentSectionIndex===0 && currentSubSectionIndex===0){
                return true;
        }
        else{
            return false;
        }
    }
    const isLastVideo=()=>{

        const currentSectionIndex= courseSectionData.findIndex(
            (data)=>data._id===sectionId
        )

        const noOfSubSection= courseSectionData[currentSectionIndex]?.subSection?.length;

        const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subSection?.findIndex(
            (data)=> data._id===subSectionId
        )

        if(currentSectionIndex ===courseSectionData.length-1  && currentSubSectionIndex === noOfSubSection-1){
                return true;
        }
        else{
            return false;
        }

    }

    const goToNextVideo=()=>{
        console.log("go to next mei section data..", courseSectionData);

        const currentSectionIndex= courseSectionData.findIndex(
            (data)=>data._id===sectionId
        )

        const noOfSubSection= courseSectionData[currentSectionIndex]?.subSection?.length;

        const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subSection?.findIndex(
            (data)=> data._id===subSectionId
        )

        if(currentSubSectionIndex !== noOfSubSection-1){
            // means Use Section mei or lecture h..
            // move to same section ki next video pr
            const nextSubSectionId= courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex+1]._id;
            navigate(`/view-courses/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)
        }
        else{
            // different section ki first video
            const nextSectionId= courseSectionData[currentSectionIndex+1]._id;
            const nextSubSectionId= courseSectionData[currentSectionIndex+1].subSection[0]._id;

            // now is pr navigate kr jao
            navigate(`/view-courses/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`)
        }
        }


    const goToPrevVideo= ()=>{

        const currentSectionIndex= courseSectionData.findIndex(
            (data)=>data._id===sectionId
        )


        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
            (data)=> data._id===subSectionId
        )

        if(currentSubSectionIndex !== 0){
            // means Use Section ka first lecture nhi h..
            // move to same section ki previous video pr
            const prevSubSectionId= courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex-1]._id;
            navigate(`/view-courses/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`)
        }
        else{
            // different section ki last video
            const prevSectionId= courseSectionData[currentSectionIndex-1]._id;
            
            const prevSubSectionLength= courseSectionData[currentSectionIndex-1].subSection.length;
            const prevSubSectionId= courseSectionData[currentSectionIndex-1].subSection[prevSubSectionLength-1]._id;

            // now is pr navigate kr jao
            navigate(`/view-courses/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`)
        }
        }

        const handleLectureCompletion = async () => {
            setLoading(true)
            const res = await markLectureAsComplete(
              { courseId: courseId, subSectionId:subSectionId },
              token
            );

            // state update kr diya slice mei
            if (res) {
              dispatch(updateCompletedLectures(subSectionId))
            }
            setLoading(false)
          }

  return (
    <div className="flex flex-col gap-5 text-white max-w-[1200px] mx-auto">
        {/* Video Player */}
        <div className="relative aspect-video">
            {!videoData ? (
                <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
               />
             )
              :(
                <Player
                  ref={playerRef}
                    aspectRatio="16:9"
                    playsInline
                    onEnded={() => setVideoEnded(true)}
                    src={videoData?.videoUrl}
                    className="rounded-md overflow-hidden"
                >
                    <AiFillPlayCircle position="center" />
                    <ControlBar autoHide={false}>
                        <PlaybackRateMenuButton
                        rates={[0.5, 1, 1.5, 2]} // Playback speed options
                        order={7} // Position in control bar
                        />
                    </ControlBar>
                    {
                        videoEnded && (
                            <div className="absolute inset-0 z-[100] grid place-content-center bg-gradient-to-t from-black/90 to-black/60">
                                <div className="flex flex-col items-center gap-4 p-6 text-center">
                                    {!completedLectures.includes(subSectionId) && (
                                        <IconBtn
                                            disabled={loading}
                                            onclick={()=> handleLectureCompletion()}
                                            text={ !loading ? "Mark as Completed": "Loading..."}
                                            customClasses="text-xl max-w-max px-4"
                                        />
                                    )}
                                    <IconBtn
                                     disabled={loading}
                                     onclick={()=> {
                                        if(playerRef?.current){
                                            // set the current time of the video to 0
                                            playerRef.current?.seek(0);
                                            setVideoEnded(false);
                                        }
                                     }}
                                     text="Rewatch"
                                     customClasses="text-xl max-w-max px-4"
                                    />
                                    <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
                                        {!isFirstVideo() && (
                                            <button
                                            disabled={loading}
                                            onClick={goToPrevVideo}
                                            className="rounded-md bg-richblack-700 px-4 py-2 text-richblack-50 hover:bg-richblack-600 transition-all duration-200"
                                            >
                                                Previous
                                            </button>
                                        )}
                                        {!isLastVideo() && (
                                            <button
                                            disabled={loading}
                                            onClick={goToNextVideo}
                                            className="rounded-md bg-yellow-50 px-4 py-2 text-richblack-900 hover:bg-yellow-100 transition-all duration-200"
                                            >
                                                Next
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </Player>
            )}
        </div>

        {/* Video Info */}
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl md:text-3xl font-semibold">{videoData?.title}</h1>
            <p className="text-sm md:text-base text-richblack-200">{videoData?.description}</p>
        </div>
    </div>
  )
}


export default VideoDetails