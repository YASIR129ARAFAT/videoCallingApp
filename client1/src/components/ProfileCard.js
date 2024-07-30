
import { Link, useNavigate } from "react-router-dom";

import { useEffect } from "react";
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
          {userData?.userType === "professional" ? (
            <b className="text-base text-green-500">Doctor</b>
          ) : (
            <b className="text-base text-red-500">Patient</b>
          )}
        </p>
        <div className="mt-7 flex flex-row flex-wrap">
          <button
            onClick={() => {
              navigate(`/otheruserprofile/${userData?._id}`);
            }}
            type="button"
            className="text-white bg-[#eb2539] hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-sans rounded-lg text-sm px-2  py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          >
            View Profile
          </button>

          {loggedInUserDetails?.userType === "professional" && <button
            type="button"
            className="text-white bg-[#eb253c] hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2"
            onClick={() => {
              navigate(`/addAppointment/${userData?._id}`)
              }
            }
          >
            Add Meet
          </button>}
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
