import React, { useEffect, useState } from "react";
import Footer from "../components/common/Footer";
import { useParams } from "react-router-dom";
import { categories } from "../services/apis";
import { getCatalogPageData } from "../services/operations/pageAndComponentsData";
import { apiConnector } from "../services/apiConnectors";
import CourseSlider from "../components/core/Catalog/CourseSlider";
import Course_Card from "../components/core/Catalog/Course_Card";
import { useSelector } from "react-redux";
import Error from "./Error"

const Catalog = () => {

  const { loading } = useSelector((state) => state.profile)
  const { catalogName } = useParams();
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [active, setActive] = useState(1);

  // fetch categories details when they click
  useEffect(() => {
    const getCategoryDetails = async () => {
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        console.log("API Response:", res);
    
        const category = res?.data?.data?.find(
          (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
        );
    
        if (!category) {
          console.error("Category not found for:", catalogName);
          return;
        }
    
        setCategoryId(category._id);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getCategoryDetails();

  }, [catalogName]);
  
  // from above when we click on the category then it give the id of that and belo effect trigger and find the data of that ID.
  useEffect(() => {
    const getCategoryDetails = async () => {
      try {
       // console.log("details fetch se phele ID kya jaa rahi..", categoryId);
        const res = await getCatalogPageData(categoryId);
       // console.log("Printing the all details...", res);
        setCatalogPageData(res);
      } catch (error) {
        console.log(error);
      }
    };
    if (categoryId) {
      getCategoryDetails();
    }
  }, [categoryId]);


  if (loading || !catalogPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }
  if (!loading && !catalogPageData.success) {
    return <Error />
  }

  return (
    <>
      {/* Hero Section */}
      <div className=" box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
          <p className="text-sm text-richblack-300">
            {"Home/Catalog/"}
            <span className="text-yellow-25">
              {catalogPageData?.data?.selectedCategory?.name}
            </span>
          </p>
          <p className="text-3xl text-richblack-5">
            {catalogPageData?.data?.selectedCategory?.name}
          </p>
          <p className="max-w-[870px] text-richblack-200">
            {catalogPageData?.data?.selectedCategory?.description}
          </p>
        </div>

        
          {/* section 1 */}
          <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">Courses to get you Started</div>
            <div className="my-4 flex border-b border-b-richblack-600 text-sm">
              <p
                className={`px-4 py-2 ${
                  active === 1
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={() => setActive(1)}
              >
                Most Populer
              </p>
              <p
                className={`px-4 py-2 ${
                  active === 2
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={() => setActive(2)}
              >
                New
              </p>
            </div>
            <div>
              {/*CourseSlider*/}
              <CourseSlider
                courses={catalogPageData?.data?.selectedCategory?.course}
              />
            </div>
          </div>

          {/* section 2 */}
          <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">
              Top Courses in {catalogPageData?.data?.selectedCategory?.name}{" "}
            </div>
            {/* <p>Top Courses</p> */}
            <div className="py-8">
              <CourseSlider
                courses={catalogPageData?.data?.diferentCategory?.course}
              />
            </div>
          </div>

          {/* section 3 */}
          <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">Frequenty Brought Together</div>
            <div className="py-8">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {catalogPageData?.data?.mostSellingCourses
                  ?.slice(0, 4)
                  .map((course, index) => (
                    <Course_Card
                      course={course}
                      key={index}
                      Height={"h-[400px]"}
                    />
                  ))}
              </div>
            </div>
          </div>
      </div>
      <Footer />
    </>
  );
};

export default Catalog;
