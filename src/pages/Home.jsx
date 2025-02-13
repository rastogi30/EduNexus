import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import HighlightText from '../components/core/HomePage/HighlightText'
import CTAButton from '../components/core/HomePage/Button'
import banner from "../assets/Images/banner.mp4"
import CodeBlocks from '../components/core/HomePage/CodeBlocks'
import TimelineSection from '../components/core/HomePage/TimelineSection'
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection'
import InstructorSection from '../components/core/HomePage/InstructorSection'
import Footer from '../components/common/Footer'
import ExploreMore from "../components/core/HomePage/ExploreMore"
import ReviewSlider from '../components/common/ReviewSlider'



const Home = () => {
  return (
    <div>
      {/* section 1 */}
      <div className='mt-16 p-1 relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white
                      justify-between' >
        <Link to={"/signup"}>
          <div className='group mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
                          transition all duration-200 hover:scale-95 w-fit drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]'>
            <div className='flex items-center gap-2 rounded-full px-10 py-[5px] transition all duration-200 group-hover:bg-richblack-900 '>
              <p>Become an Instructor</p>
              <FaArrowRight/>
            </div>
          </div>
        </Link>

        <div className='text-center text-4xl font-semibold mt-7'>
            Empower Your Future With
            <HighlightText text={" Coding Skills"} />
        </div>

        <div className='mt-3 w-[90%] text-center text-lg font-bold text-richblack-300'>
        With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to 
        a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
        </div>

        <div className='flex flex-row gap-7 mt-10'>
        <CTAButton active={true} linkto={"/signup"}>
           Learn More
         </CTAButton>
        <CTAButton active={false} linkto={"/signup"}> 
           Book A Demo
        </CTAButton>
        </div>

        <div className="mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
          <video 
           className="shadow-[10px_10px_rgba(255,255,255)]"
           muted loop autoPlay>
            <source src={banner} type='video/mp4' />
          </video>
        </div>

        {/* code section 1 */}
        <div>
          <CodeBlocks
            position={"lg:flex-row flex flex-col"}
            heading={
                  <div className='text-4xl font-semibold'>
                    Unlock your
                    <HighlightText text={" Coding Potential "}/>
                    with our online courses.
                  </div>
            }

            subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
           
           ctabtn1={
              {btnText: "Try It Yourself",
              linkto: "/signup",
              active:true,}
            }
           ctabtn2={
              {btnText: "Learn More",
              linkto: "/login",
              active:false,}
            }

            codeblock={`<!DOCTYPE html> 
            <html lang="en">
            <head>
            <title>This is myPage</title>
            </head>
            <body>
            <h1><a href="/">Header</a></h1>
            <nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>
            </nav></body>`}
            codeColor={"text-yellow-25"}
            backgroundGradient={<div className="codeblock1 absolute"></div>}
          />
        </div>

        {/* code section 2 */}
        <div>
          <CodeBlocks
            position={"lg:flex-row flex flex-col"}
            heading={
                  <div className='text-4xl font-semibold'>
                    Start 
                    <HighlightText text={" Coding in Seconds"}/>
                  </div>
            }

            subheading={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
           
           ctabtn1={
              {btnText: "Continue Lesson",
              linkto: "/signup",
              active:true,}
            }
           ctabtn2={
              {btnText: "Learn More",
              linkto: "/login",
              active:false,}
            }

            codeblock={`import React from "react";
             import CTAButton from "./Button";
             import TypeAnimation from "react-type";
             import { FaArrowRight } from "react-icons/fa";
             const Home = () => {\nreturn (\n<div>Home</div>\n)}\n
             export default Home;`}
            codeColor={"text-white"}
            backgroundGradient={<div className="codeblock2 absolute"></div>}
          />
        </div>

        <ExploreMore/>

      </div>

      {/* section 2 */}
      <div className='bg-pure-greys-5 text-richblack-700'>
      <div className='homepage_bg h-[320px]'>
        <div className='w-11/12 max-w-maxContent flex flex-col items-center gap-5 mx-auto justify-center'>
        <div className='h-[190px]'></div>
         {/* button */}
          <div className='flex flex-row gap-7 text-white'>
             <CTAButton active={true} linkto={"/signup"}>
             <div className='flex items-center gap-2'>
              Explore Full Catalog
              <FaArrowRight/>
             </div>
             </CTAButton>
             <CTAButton active={false} linkto={"/signup"}>
                <div>
                  Learn More
                </div>
             </CTAButton>
              
          </div>

        </div>
      </div>
      
      <div className='w-11/12 max-w-maxContent flex flex-col items-center mx-auto justify-center gap-5'>

              <div className='flex flex-row gap-5 mt-[100px]'>
                <div className='text-4xl font-semibold w-[45%]'>
                Get the skills you need for a
                <HighlightText text={"  Job that is in demand"} />
                </div>
                <div className='ml-5 flex flex-col gap-10 w-[40%] items-start'>
                  <div className='text-[16px]'>
                      The modern EduNexus is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.                  </div>
                  <div>
                      <CTAButton active={true} linkto={"/signup"}>
                      <div>
                          Learn More
                        </div>
                      </CTAButton>
                  </div>

                </div>
              </div>

            <TimelineSection/>
            <LearningLanguageSection/>
      </div>
      </div>



      {/* section 3 */}
      <div className='w-11/12 mx-auto max-w-maxContent flex flex-col items-center justify-between
        gap-8 bg-richblack-900 text-white'>

      <InstructorSection/>

      <h2 className='text-center text-4xl font-semibold mt-8'>
        Reviews from other learners
      </h2>
      <div className='w-full'>
        <ReviewSlider/>
      </div>
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  )
}

export default Home