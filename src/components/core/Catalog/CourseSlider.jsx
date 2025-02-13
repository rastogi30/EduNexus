import React from 'react'

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, FreeMode, Pagination, Navigation } from "swiper/modules"
import Course_Card from './Course_Card'

// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"


const CourseSlider = ({courses}) => {
    console.log("CourseSlider mei course aa rahe ya nhi..", courses);
  return (
    <div>
        {
            courses?.length ?  (
                <Swiper slidesPerView={3}
                    spaceBetween={10}
                    loop={true}
                    modules={[Autoplay, FreeMode, Pagination,Navigation]}
                    Pagination={true}
                    navigation={true}
                    autoplay={{
                        delay:1000,
                        disableOnInteraction:false,
                    }}
                    breakpoints={{
                        320: { slidesPerView: 1 }, // 1 slide for small screens
                        640: { slidesPerView: 2 }, // 2 slides for tablets
                        1024: { slidesPerView: 3 }, // 3 slides for desktops
                    }}
                    className="max-h-[30rem]">
                {
                    courses.map((course,index)=>(
                        <SwiperSlide key={index}>
                            <Course_Card course={course} Height={"h-[250px]"}/>
                        </SwiperSlide>
                    ))
                }
                </Swiper>
               
            ) :
             (<p className="text-xl text-richblack-5">No Course Found</p>) 
        }

    </div>
  )
}

export default CourseSlider