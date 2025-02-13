import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI'
import IconBtn from '../../common/IconBtn'
import CourseTable from "./InstructorCourses/CourseTable"
import { Plus } from "lucide-react"

const MyCourses = () => {
    const { token } = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const result = await fetchInstructorCourses(token)
                console.log("Course structure:", result);
                if (result) {
                    setCourses(result)
                }
            } catch (error) {
                console.error("Error fetching courses:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchCourses()
    }, [token])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-[1000px] py-8 px-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <h1 className="text-3xl font-medium text-richblack-5">
                    My Courses
                </h1>
                <IconBtn
                    text="Add Course"
                    onclick={() => navigate("/dashboard/add-course")}
                >
                    <Plus className="h-4 w-4" />
                </IconBtn>
            </div>

            {courses.length > 0 ? (
                <CourseTable courses={courses} setCourses={setCourses} />
            ) : (
                <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
                    <p className="text-lg text-richblack-300">
                        You haven't created any courses yet
                    </p>
                    <IconBtn
                        text="Create Your First Course"
                        onclick={() => navigate("/dashboard/add-course")}
                    >
                        <Plus className="h-4 w-4" />
                    </IconBtn>
                </div>
            )}
        </div>
    )
}

export default MyCourses