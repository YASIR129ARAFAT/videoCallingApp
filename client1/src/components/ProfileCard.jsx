import profilePic from "../assets/images.png";
import { Link, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
function ProfileCard({ userData, loggedInUserDetails, className = "" }) {
  const navigate = useNavigate();

  useEffect(() => {}, []);
  return (
    <div
      href="#"
      className={`ml-4 mt-4 flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 ${className}`}
    >
      <img
        className="p-4 object-cover w-full rounded-t-lg h-96 md:h-auto md:w-40 md:rounded-full md:rounded-s-full"
        src={
          userData?.image ||
          `https://coenterprises.com.au/wp-content/uploads/2018/02/male-placeholder-image.jpeg`
        }
        alt="ef"
      />
      <div className="mt-2 flex flex-col justify-between p-3 leading-normal">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {userData?.name}
        </h5>
        <p className="mb-1 font-normal text-black dark:text-gray-400">
          {userData?.email}
        </p>
        <p className="mb-1 font-sans text-base text-black dark:text-gray-400">
          <b className="text-base">Enrolment No:</b> {userData?.enrolmentNo}
        </p>
        <p className="mb-1 font-sans text-base text-black dark:text-gray-400">
          {userData?.isAdmin === true ? (
            <b className="text-base text-red-500">Admin</b>
          ) : (
            <b className="text-base text-green-500">Student</b>
          )}
        </p>
        <div className="mt-7 flex flex-row flex-wrap">
          <button
            onClick={() => {
              navigate(`/otheruserprofile/${userData?._id}`);
            }}
            type="button"
            className="text-white bg-[#2563EB] hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-sans rounded-lg text-sm px-2  py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            View Profile
          </button>

          <button
            type="button"
            className="text-white bg-[#2563EB] hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2"
            onClick={() => {
              let url = userData?.resume || "";
              console.log(url);
              if (!url || url==="") {
                alert("No resume URL available");
                return;
              }
              else if (!url.startsWith("http://") && !url.startsWith("https://")) {
                url = "https://" + url;
              }
              try {
                window.open(url, "_blank", "noopener,noreferrer");
              } catch (error) {
                console.error("Error opening URL:", error);
                alert("Unable to open the resume. Please check the URL.");
              }
            }}
          >
            Resume
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
