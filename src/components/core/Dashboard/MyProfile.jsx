import React from "react";
import { Edit } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconBtn from "../../common/IconBtn";

import { formattedDate } from "../../../utils/dateFormatter";

const MyProfile = () => {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  const ProfileSection = ({ children, title, editButton = true }) => (
    <div className="flex flex-col gap-y-6 rounded-lg border border-richblack-700 bg-richblack-800 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-richblack-5">{title}</h2>
        {editButton && (
          <IconBtn
            text="Edit"
            onclick={() => navigate("/dashboard/settings")}
          >
            <Edit className="h-4 w-4" />
          </IconBtn>
        )}
      </div>
      {children}
    </div>
  );

  return (
    <div className="mx-auto max-w-[1000px] py-8 px-4">
      <h1 className="mb-8 text-3xl font-medium text-richblack-5">
        My Profile
      </h1>

      <div className="flex flex-col gap-6">
        {/* Profile Information */}
        <ProfileSection title="Profile Information">
          <div className="flex flex-col md:flex-row items-start gap-4">
            <img
              src={user?.image}
              alt={`profile-${user?.firstName}`}
              className="aspect-square w-[78px] rounded-full object-cover"
            />
            <div>
              <p className="text-lg font-semibold text-richblack-5">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-richblack-300">{user?.email}</p>
            </div>
          </div>
        </ProfileSection>

        {/* About */}
        <ProfileSection title="About">
          <p className={`text-sm ${user?.additionalDetails?.about ? "text-richblack-5" : "text-richblack-400"}`}>
            {user?.additionalDetails?.about ?? "Write Something About Yourself"}
          </p>
        </ProfileSection>

        {/* Personal Details */}
        <ProfileSection title="Personal Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <InfoItem
                label="First Name"
                value={user?.firstName}
              />
              <InfoItem
                label="Email"
                value={user?.email}
              />
              <InfoItem
                label="Gender"
                value={user?.additionalDetails?.gender ?? "Add Gender"}
              />
            </div>
            <div className="space-y-4">
              <InfoItem
                label="Last Name"
                value={user?.lastName}
              />
              <InfoItem
                label="Phone Number"
                value={user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
              />
              <InfoItem
                label="Date Of Birth"
                value={formattedDate(user?.additionalDetails?.dateOfBirth) ?? "Add Date Of Birth"}
              />
            </div>
          </div>
        </ProfileSection>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div>
    <p className="mb-2 text-sm text-richblack-600">{label}</p>
    <p className="text-sm font-medium text-richblack-5">{value}</p>
  </div>
);

export default MyProfile;
