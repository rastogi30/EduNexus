import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import RenderSteps from "../AddCourses/RenderSteps";
import {
  setCourse,
  setEditCourse,
} from "../../../../reducer/slices/courseSlice";
import { getFullDetailsOfCourse } from "../../../../services/operations/courseDetailsAPI";

const EditCourse = () => {
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const { course } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(null);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {(async () => {
      setLoading(true);
      const result = await getFullDetailsOfCourse(courseId, token);
      if (result?.courseDetails) {
        dispatch(setEditCourse(true));
        dispatch(setCourse(result?.courseDetails));
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div>Loading....</div>;
  }
  return (
    <div>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">Edit Course</h1>
      <div className="mx-auto max-w-[600px]">
         {course ? <RenderSteps /> : (
            <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">Course Not Found</p>
            )}
         </div>
    </div>
  );
};

export default EditCourse;
