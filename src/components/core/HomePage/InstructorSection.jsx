import React from "react";
import instructor from "../../../assets/Images/Instructor.png";
import HighlightText from "./HighlightText";
import CTAButton from "./Button";
import { FaArrowRight } from "react-icons/fa";

const InstructorSection = () => {
  return (
    <div className="mt-16 mb-32">
      <div className="flex felx-col lg:flex-row gap-20 items-center">
        {/* left side */}
        <div className="lg:w-[50%]  shadow-white shadow-[10px_10px_0px_0px]">
          <img
            src={instructor}
            alt="Instructor image"
            className="shadow-white shadow-[5px_5px_0px_0px]"
          />
        </div>

        {/* right */}
        <div className="lg:w-[50%] flex gap-10 flex-col">
          <div className="text-4xl items-center font-inter lg:w-[50%] font-semibold ">
            Become an <HighlightText text={"Instructor"} />
          </div>
          <p className="font-medium text-[16px] w-[80%] text-richblack-300">
            Instructors from around the world teach millions of students on
            EduNexus. We provide the tools and skills to teach what you love.
          </p>

          <div className="w-fit mt-6">
            <CTAButton active={true} linkto={"/signup"}>
              <div className="flex flex-row gap-2 items-center justify-center ">
                Start Learning Today
                <FaArrowRight />
              </div>
            </CTAButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorSection;
