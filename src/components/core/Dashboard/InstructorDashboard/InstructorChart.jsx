import { useState } from "react"
import { Chart, registerables } from "chart.js"
import { Pie } from "react-chartjs-2"

Chart.register(...registerables)

export default function InstructorChart({ courses }) {
  const [currChart, setCurrChart] = useState("students")

  const generateRandomColors = (numColors) => {
    const colors = []
    for (let i = 0; i < numColors; i++) {
      const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)})`
      colors.push(color)
    }
    return colors
  }

  const chartDataStudents = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalStudentEnrolled),
        backgroundColor: generateRandomColors(courses.length),
      },
    ],
  }

  const chartIncomeData = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalAmountGenerated),
        backgroundColor: generateRandomColors(courses.length),
      },
    ],
  }

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: window.innerWidth < 768 ? 'bottom' : 'right',
        labels: {
          boxWidth: 10,
          padding: 15,
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          }
        }
      },
      tooltip: {
        bodyFont: {
          size: window.innerWidth < 768 ? 12 : 14
        }
      }
    }
  }

  return (
    <div className="flex flex-col h-full rounded-md bg-richblack-800 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <p className="text-lg font-bold text-richblack-5">Visualize</p>
        <div className="flex gap-2 bg-richblack-700 p-1 rounded-full">
          <ChartButton
            active={currChart === "students"}
            onClick={() => setCurrChart("students")}
          >
            Students
          </ChartButton>
          <ChartButton
            active={currChart === "income"}
            onClick={() => setCurrChart("income")}
          >
            Income
          </ChartButton>
        </div>
      </div>

      <div className="relative flex-1 min-h-[300px] md:min-h-[400px]">
        <Pie
          data={currChart === "students" ? chartDataStudents : chartIncomeData}
          options={options}
        />
      </div>
    </div>
  )
}

const ChartButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
      active
        ? "bg-yellow-50 text-richblack-900 font-semibold"
        : "text-yellow-50 hover:bg-richblack-600"
    }`}
  >
    {children}
  </button>
)