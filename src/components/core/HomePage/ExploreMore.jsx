import React, { useState } from 'react'
import {HomePageExplore} from "../../../data/homepage-explore"
import HighlightText from './HighlightText';
import CourseCard from './CourseCard';

const tabsName=[
    "Free",
    "New to Coding",
    "Most Popular",
    "Skills Paths",
    "Career Paths",
];

const ExploreMore = () => {

    const [currentTab, setCurrentTab]= useState(tabsName[0]);
    const [courses, setCourses]= useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard]= useState(HomePageExplore[0].courses[0].heading);

    const setMyCards=(value)=>{
        setCurrentTab(value);
        const result= HomePageExplore.filter((courses) => courses.tag === value);
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);
    }

  return (
    <div>
        <div className='text-4xl font-semibold text-center font-inter mb-[100px]'>
            Unlock the
            <HighlightText text={" Power of Code"} /> 
            <p className='text-center text-richblack-200 text-lg mt-3'>
        Learn To Build Any Thing You Can Imagine</p>

        </div>
        
        <div className='hidden lg:flex mx-auto w-max rounded-full font-medium text-richblack-200 bg-richblack-800 mb-5 p-1
                        drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]'>
            {
                tabsName.map((element, index)=>{
                    return(
                        <div className={`text-[16px] flex flex-row items-center gap-2
                        ${currentTab === element ? "bg-richblack-900 text-richblack-5 font-medium":
                        "text-richblack-200"} 
                        rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 
                        hover:text-richblack-25 px-7 py-2`} key={index}
                        onClick={()=> setMyCards(element)}>
                            {element}
                        </div>
                    )
                })
            }
        </div>

        <div className='lg:h-[150px]'>
            {/* course card */}
            <div className="lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full 
            lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3">
      {
        courses.map((element,index)=>{
          return(
            <CourseCard
              key={index}
              cardData = {element}
              currentCard = {currentCard}
              setCurrentCard = {setCurrentCard}
            />
          )
        })
      }
    </div>
    </div>

    </div>
  )
}

export default ExploreMore