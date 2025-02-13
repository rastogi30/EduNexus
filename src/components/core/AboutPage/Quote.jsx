import React from 'react'
import HighlightText from '../HomePage/HighlightText'

const Quote = () => {
  return (
    <div>
        <div className=" text-xl md:text-2xl font-semibold mx-auto py-5 pb-20 text-center text-white w-[80%]">
            we are passionate about revolutionizing the way we learn. Our innovation platform
            <HighlightText text={" combine technology "}/>
            <span className="bg-gradient-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text font-bold">
                expertise
            </span>
            , and community to create an 
            <span className="bg-gradient-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text font-bold">
                {" "}unparalleled education experience
            </span>
        </div>
    </div>
  )
}

export default Quote