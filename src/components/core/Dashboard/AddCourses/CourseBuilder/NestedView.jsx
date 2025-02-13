import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import {RxDropdownMenu} from "react-icons/rx"
import { MdEdit } from 'react-icons/md';
import {RiDeleteBin6Line} from "react-icons/ri"
import { BiSolidDownArrow } from 'react-icons/bi'
import { FaPlus } from "react-icons/fa" 
import SubSectionModal from './SubSectionModal';
import ConfirmationModal from "../../../../common/ConfirmationModal"
import { setCourse } from '../../../../../reducer/slices/courseSlice';
import { deleteSubSection } from '../../../../../services/operations/courseDetailsAPI';
import { deleteSection } from '../../../../../services/operations/courseDetailsAPI';
import { useSelector } from 'react-redux';
import { BiSolidRightArrow } from "react-icons/bi";


const NestedView = ({handleChangedEditSectionName}) => {

    const {course}= useSelector((state)=>state.course);
    const {token}= useSelector((state)=>state.auth);
    
     // Track which sections are open/closed
        const [openSections, setOpenSections] = useState({});

        const toggleSection = (sectionId) => {
            setOpenSections((prev) => ({
            ...prev,
            [sectionId]: !prev[sectionId], // Toggle only this section
            }));
        };

    const dispatch=useDispatch(); 

    // States to keep track of mode of modal [add, view, edit]
    const[addSubSection, setAddSubSection]= useState(null);
    const[viewSubSection, setViewSubSection]= useState(null);
    const[editSubSection, setEditSubSection]= useState(null);
     // to keep track of confirmation modal
    const[confirmationModal, setConfirmationModal]= useState(null);

    const handleDeleteSection =async (sectionId)=>{
       // console.log("sectionId...", sectionId);
       //console.log("courseId...", course._id);
        
        const result = await deleteSection({
            sectionId,
            courseId:course._id,
            token,
        })
       // console.log("front end mei delete ke liye id...", result);
        if(result){
            dispatch(setCourse(result))
        }
        setConfirmationModal(null);
    }

    const handleDeleteSubSection = async (subSectionId, sectionId)=>{
        const result = await deleteSubSection({subSectionId, sectionId, token});
        // console.log("handle delete mei sectionId", sectionId);
        // console.log("handle delete mei subSectionId", subSectionId);
        // console.log("Handle delete Sub Section mei kya aya...", result);

        if(result){
            const updatedCourseContent= course.courseContent.map((section) => 
                                            section._id === sectionId ? result : section);
            const updatedCourse= {...course, courseContent:updatedCourseContent};
            dispatch(setCourse(updatedCourse));
        }
        setConfirmationModal(null);
    }
    
  return (
    <div>
    
        <div  className="rounded-lg bg-richblack-700 p-6 px-8">
        {
            course?.courseContent?.map((section)=>(
                // Section Dropdown
                <details key={section._id} open  onClick={() => toggleSection(section._id)}>
                {/* Section Dropdown Content */}
                    <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
                        <div className="flex items-center gap-x-3">
                            <RxDropdownMenu className="text-2xl text-richblack-50"/>
                            <p className="font-semibold text-richblack-50">{section.sectionName}</p>
                        </div>
                        <div className="flex items-center gap-x-3">
                            <button onClick={() => handleChangedEditSectionName(section._id, section.sectionName)}>
                                <MdEdit className="text-xl text-richblack-300"/>
                            </button>

                            <button onClick={()=>{
                                setConfirmationModal({
                                    text1:"Delete this Section",
                                    text2:"All the lecture in this Section will be deleted",
                                    btn1Text:"Delete",
                                    btn2Text:"Cancel",
                                    btn1Handler:()=>handleDeleteSection(section._id),
                                    btn2Handler:()=>setConfirmationModal(null),

                                })
                            }}>
                                <RiDeleteBin6Line className="text-xl text-richblack-300"/>
                            </button>

                            <span className="font-medium text-richblack-300"> | </span>
                            {openSections[section._id] ? (
                            <BiSolidRightArrow
                           // onClick={() => toggleSection(section._id)}
                            className="text-xl text-richblack-300"
                            />) : (
                            <BiSolidDownArrow
                           // onClick={() => toggleSection(section._id)}
                            className="text-xl text-richblack-300"
                            />
                           )}
                        </div>
                    </summary>
                    <div className="px-6 pb-4">
                        {
                         /* Render All Sub Sections Within a Section */
                            section.subSection.map((data)=>(
                                <div key={data?.id}
                                    onClick={()=>setViewSubSection(data)}
                                    className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2">
                                    <div className="flex items-center gap-x-3 py-2 ">
                                        <RxDropdownMenu className="text-2xl text-richblack-50"/>
                                        <p className="font-semibold text-richblack-50">{data.title}</p>
                                    </div>
                                    <div onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-x-3">
                                        <button 
                                        onClick={()=> setEditSubSection({...data, sectionId:section._id})}>
                                            <MdEdit className="text-xl text-richblack-300"/>
                                        </button>
                                        <button onClick={()=>{
                                        setConfirmationModal({
                                            text1:"Delete this Sub Section",
                                            text2:"Selected lecture will be deleted",
                                            btn1Text:"Delete",
                                            btn2Text:"Cancel",
                                            btn1Handler:()=>handleDeleteSubSection(data._id ,section._id),
                                            btn2Handler:()=>setConfirmationModal(null),

                                        })}}>
                                        <RiDeleteBin6Line className="text-xl text-richblack-300"/>
                                       </button>
                                    </div>
                                </div>
                            ))}

                            <button onClick={()=> setAddSubSection(section._id)}
                             className="mt-3 flex items-center gap-x-1 text-yellow-50"> 
                             <FaPlus className="text-lg" />
                              <p>Add Lecture</p>
                            </button>
                         </div>
                        
                </details>  
            ))}
        </div>

          {/* Modal Display */}
        {
            addSubSection ?
             (<SubSectionModal
                modalData={addSubSection}
                setModalData={setAddSubSection}
                add={true}
            />)
            : viewSubSection ? 
             (<SubSectionModal
                modalData={viewSubSection}
                setModalData={setViewSubSection}
                view={true}
            />)
            : editSubSection ? 
              (<SubSectionModal
                modalData={editSubSection}
                setModalData={setEditSubSection}
                edit={true}
            />)
            :(<div></div>)
        }
        {/* Confirmation Modal */}
        {
            confirmationModal ? ( <ConfirmationModal modalData={confirmationModal}/>) : (<div></div>)
        }
    </div>
  )
}
export default NestedView