import React, { useEffect, useState } from 'react'

import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, FreeMode, Pagination, Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "swiper/css/navigation"

import ReactStars from 'react-stars'
import { ratingsEndpoints } from '../../services/apis'
import { apiConnector } from '../../services/apiConnectors'
import { FaStar } from 'react-icons/fa'

const truncateWords = 15

const ReviewSlider = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllReviews = async () => {
            setLoading(true);
            try {
                const { data } = await apiConnector("GET", ratingsEndpoints.REVIEWS_DETAILS_API);
                if(data?.success) {
                    setReviews(data?.data);
                }
            } catch (error) {
                console.log("Could not fetch reviews");
            }
            setLoading(false);
        }
        fetchAllReviews();
    }, [])

    if(loading) {
        return (
            <div className="h-[184px] flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <div className="text-white w-full">
            <div className="my-[50px] h-[184px] max-w-maxContentTab lg:max-w-maxContent">
                <Swiper
                    slidesPerView={1}
                    spaceBetween={24}
                    loop={true}
                    freeMode={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 4,
                        },
                    }}
                    modules={[FreeMode, Pagination, Autoplay]}
                    className="w-full h-full"
                >
                    {reviews.map((review, index) => (
                        <SwiperSlide key={index}>
                            <div className="flex flex-col gap-3 bg-richblack-800 p-3 text-[14px] text-richblack-25">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={
                                            review?.user?.image
                                            ? review?.user?.image
                                            : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                                        }
                                        alt="Profile pic"
                                        className="h-9 w-9 rounded-full object-cover"
                                    />
                                    <div className="flex flex-col">
                                        <h1 className="font-semibold text-richblack-5">
                                            {`${review?.user?.firstName} ${review?.user?.lastName}`}
                                        </h1>
                                        <h2 className="text-[12px] font-medium text-richblack-500">
                                            {review?.course?.courseName}
                                        </h2>
                                    </div>
                                </div>

                                <p className="font-medium text-richblack-25">
                                    {review?.review.split(" ").length > truncateWords
                                        ? `${review?.review.split(" ").slice(0, truncateWords).join(" ")}...`
                                        : review?.review}
                                </p>

                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-yellow-100">
                                    {Number(review.rating || 0).toFixed(1)}
                                    </span>
                                    <ReactStars
                                        count={5}
                                        value={review.rating}
                                        size={20}
                                        edit={false}
                                        activeColor="#ffd700"
                                        emptyIcon={<FaStar />}
                                        fullIcon={<FaStar />}
                                    />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}

export default ReviewSlider