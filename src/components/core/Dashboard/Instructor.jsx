import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
import { getInstructorData } from "../../../services/operations/profileAPI"
import InstructorChart from "./InstructorDashboard/InstructorChart"

export default function Instructor() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const [loading, setLoading] = useState(false)
  const [instructorData, setInstructorData] = useState(null)
  const [courses, setCourses] = useState([])

  useEffect(() => {
    (async () => {
      setLoading(true)
      const instructorApiData = await getInstructorData(token)
      const result = await fetchInstructorCourses(token)
      if (instructorApiData.length) setInstructorData(instructorApiData)
      if (result) {
        setCourses(result)
      }
      setLoading(false)
    })()
  }, [])

  const totalAmount = instructorData?.reduce(
    (acc, curr) => acc + curr.totalAmountGenerated,
    0
  )

  const totalStudents = instructorData?.reduce(
    (acc, curr) => acc + curr.totalStudentEnrolled,
    0
  )

  return (
    <div className="p-4 md:p-6">
      <div className="space-y-2">
        <h1 className="text-xl md:text-2xl font-bold text-richblack-5">
          Hi {user?.firstName} 👋
        </h1>
        <p className="text-sm md:text-base font-medium text-richblack-200">
          Let's start something new
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="spinner"></div>
        </div>
      ) : courses.length > 0 ? (
        <div>
          <div className="my-4 flex flex-col lg:flex-row gap-4 min-h-[450px]">
            {/* Chart Section */}
            <div className="w-full lg:w-2/3">
              {totalAmount > 0 || totalStudents > 0 ? (
                <InstructorChart courses={instructorData} />
              ) : (
                <div className="h-full rounded-md bg-richblack-800 p-6">
                  <p className="text-lg font-bold text-richblack-5">Visualize</p>
                  <p className="mt-4 text-xl font-medium text-richblack-50">
                    Not Enough Data To Visualize
                  </p>
                </div>
              )}
            </div>

            {/* Statistics Section */}
            <div className="w-full lg:w-1/3">
              <div className="h-full rounded-md bg-richblack-800 p-6">
                <p className="text-lg font-bold text-richblack-5">Statistics</p>
                <div className="mt-4 space-y-4">
                  <StatCard
                    title="Total Courses"
                    value={courses?.length}
                  />
                  <StatCard
                    title="Total Students"
                    value={totalStudents}
                  />
                  <StatCard
                    title="Total Income"
                    value={`Rs. ${totalAmount}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Course Preview Section */}
          <div className="rounded-md bg-richblack-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-lg font-bold text-richblack-5">Your Courses</p>
              <Link to="/dashboard/my-courses">
                <p className="text-xs font-semibold text-yellow-50">View All</p>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.slice(0, 3).map((course) => (
                <div key={course._id} className="bg-richblack-700 rounded-lg overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="p-4">
                    <p className="text-sm font-medium text-richblack-50 line-clamp-1">
                      {course.courseName}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="text-richblack-300">
                        {course.studentEnrolled.length} students
                      </span>
                      <span className="text-richblack-300">|</span>
                      <span className="text-richblack-300">
                        Rs. {course.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-10 rounded-md bg-richblack-800 p-6">
          <p className="text-center text-xl md:text-2xl font-bold text-richblack-5">
            You have not created any courses yet
          </p>
          <Link to="/dashboard/add-course">
            <p className="mt-4 text-center text-base md:text-lg font-semibold text-yellow-50">
              Create a course
            </p>
          </Link>
        </div>
      )}
    </div>
  )
}

const StatCard = ({ title, value }) => (
  <div className="rounded-md bg-richblack-700 p-4">
    <p className="text-base text-richblack-200">{title}</p>
    <p className="mt-2 text-2xl font-semibold text-richblack-50">
      {value}
    </p>
  </div>
)