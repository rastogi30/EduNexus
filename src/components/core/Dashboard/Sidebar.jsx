import React, { useState, useEffect } from 'react'
import { sidebarLinks } from "../../../data/dashboard-links"
import { logout } from "../../../services/operations/authAPI"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import SidebarLink from './SidebarLink'
import { Menu, X, LogOut, Settings, ChevronDown } from 'lucide-react'
import ConfirmationModal from "../../common/ConfirmationModal"
import { ACCOUNT_TYPE } from '../../../utils/constants'
import { categories } from '../../../services/apis'
import { apiConnector } from '../../../services/apiConnectors'

const Sidebar = () => {
    const { user, loading: profileLoading } = useSelector((state) => state.profile);
    const { loading: authLoading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [confirmationModal, setConfirmationModal] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showCatalog, setShowCatalog] = useState(false);
    const [catalogData, setCatalogData] = useState([]);

    // Fetch catalog data for student
    useEffect(() => {
        if (user?.accountType === ACCOUNT_TYPE.STUDENT) {
            const fetchCatalog = async () => {
                try {
                    const response = await apiConnector("GET", categories.CATEGORIES_API);
                    console.log("Categories API Response:", response);
                    if (response?.data?.data) {
                        console.log("Setting catalog data:", response.data.data);
                        setCatalogData(response.data.data);
                    }
                } catch (error) {
                    console.error("Error fetching catalog:", error);
                }
            };
            fetchCatalog();
        }
    }, [user]);

    // Add this to check if catalogData is being updated
    useEffect(() => {
        console.log("Current catalogData:", catalogData);
    }, [catalogData]);

    if (profileLoading || authLoading) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
                <div className="spinner"></div>
            </div>
        )
    }

    // Student Catalog Section Component
    const StudentCatalogSection = () => {
        if (user?.accountType !== ACCOUNT_TYPE.STUDENT) return null;

        const handleCategoryClick = (categoryName) => {
            // Format the category name for URL
            const formattedName = categoryName.split(" ").join("-").toLowerCase();
            // Close menus
            setShowCatalog(false);
            setIsMobileMenuOpen(false);
            // Navigate to the category page
            navigate(`/catalog/${formattedName}`);
        };

        return (
            <div className="flex flex-col gap-2 border-b border-richblack-700 pb-4">
                <button
                    onClick={() => setShowCatalog(!showCatalog)}
                    className="flex items-center justify-between px-4 py-2 text-sm font-medium text-richblack-300 hover:text-yellow-50 transition-all duration-200"
                >
                    <span>Explore Catalog</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showCatalog ? "rotate-180" : ""}`} />
                </button>

                {showCatalog && (
                    <div className="flex flex-col gap-1 pl-4">
                        {catalogData?.map((category) => (
                            <button
                                key={category._id}
                                onClick={() => handleCategoryClick(category.name)}
                                className="px-4 py-2 text-sm text-richblack-300 hover:bg-yellow-800 hover:text-yellow-50 rounded-lg transition-all duration-200 text-left"
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="fixed top-4 right-4 z-[60] rounded-full p-2 bg-richblack-800 text-richblack-25 md:hidden hover:bg-richblack-700 transition-all duration-200"
            >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Sidebar Container */}
            <div className={`
                fixed md:static top-0 left-0 h-screen md:h-[calc(100vh-3.5rem)] bg-richblack-800 
                transition-all duration-300 ease-in-out z-50
                ${isMobileMenuOpen ? 'w-[250px]' : 'w-0 md:w-[220px]'}
                border-r-[1px] border-r-richblack-700
            `}>
                <div className="flex h-full flex-col overflow-y-auto">
                    {/* Logo for mobile */}
                    <div className="md:hidden flex items-center justify-center h-14 border-b border-richblack-700 bg-richblack-900">
                        <img
                            src="https://res.cloudinary.com/dqclwnyni/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1738871022/1_enhanced_lfj1vn.png"
                            alt="Logo"
                            className="h-8"
                        />
                    </div>

                    {/* Links Section */}
                    <div className="flex-1 py-6 px-4">
                        {/* Add Student Catalog Section for mobile */}
                        <StudentCatalogSection />

                        <div className="flex flex-col gap-2">
                            {sidebarLinks.map((link) => {
                                if (link.type && user?.accountType !== link.type) return null;
                                return (
                                    <SidebarLink 
                                        key={link.id} 
                                        link={link} 
                                        iconName={link.icon}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    />
                                )
                            })}
                        </div>

                        <div className='my-6 h-[1px] bg-richblack-700'></div>

                        {/* Settings and Logout */}
                        <div className="flex flex-col gap-2">
                            <SidebarLink
                                link={{ name: "Settings", path: "dashboard/settings" }}
                                iconName="Settings"
                                onClick={() => setIsMobileMenuOpen(false)}
                            />

                            <button
                                onClick={() => setConfirmationModal({
                                    text1: "Are You Sure?",
                                    text2: "You will be logged out of your account",
                                    btn1Text: "Logout",
                                    btn2Text: "Cancel",
                                    btn1Handler: () => dispatch(logout(navigate)),
                                    btn2Handler: () => setConfirmationModal(null),
                                })}
                                className="flex items-center gap-x-2 px-4 py-2 text-sm font-medium text-richblack-300 hover:bg-pink-200/10 hover:text-pink-300 rounded-lg transition-all duration-200"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>

                    {/* User Info at Bottom */}
                    <div className="mt-auto p-4 border-t border-richblack-700 bg-richblack-900">
                        <div className="flex items-center gap-x-3">
                            <img 
                                src={user?.image} 
                                alt={user?.firstName}
                                className="h-10 w-10 rounded-full object-cover border border-richblack-700"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-richblack-25 truncate">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-xs text-richblack-400 truncate">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-richblack-900/50 backdrop-blur-sm md:hidden z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
        </>
    )
}

export default Sidebar