import React, { useState, useEffect } from "react";
import { Link, useActionData } from "react-router-dom";
import { getLoggedInUserDetails } from "../utils/getLoggedInUserDetails";

function UserInfoCard({ className = "", userData, children }) {
  const [loading, setLoading] = useState(false);
  const [loggedInUserDetails, setLoggedInUserDetails] = useState({});
  // console.log("userdata: ", userData);
  useEffect(() => {
    async function getData() {
      try {
        const data = await getLoggedInUserDetails();
        setLoggedInUserDetails(data);
      } catch (error) {
        console.log(error);
      }
    }
    getData();
  }, []);

  return (
    <section
      className={` mt-8 bg-blue-50 w-full dark:bg-gray-900 ${className}`}
    >
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:pt-8">
            <div className="flex justify-between items-start mb-0">
              {" "}
              {/* Adjusted spacing */}
              {/* Image section */}
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                {userData?.name}
                <p className="text-base ml-0 text-red-700">
                  {userData?.userType?.charAt(0)?.toUpperCase() +
                    userData?.userType?.slice(1)}
                  {/* {userData?.userType} */}
                </p>
              </h1>
              <img
                className="w-16 h-16 rounded-full border border-s border-blue-400 mr-4"
                src={userData?.image || `https://coenterprises.com.au/wp-content/uploads/2018/02/male-placeholder-image.jpeg`}
                alt="user"
              />
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className=" space-y-4 md:space-y-4">
                {" "}
                {/* Adjusted spacing */}
                {/* <div className="flex flex-wrap -mx-2">
                  <div className="w-1/2 px-2 mb-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      <b>Name:</b> {userData?.name}
                    </p>
                  </div>
                </div> */}
                <div className="mb-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    <b>Email: </b>
                    {userData?.email}
                  </p>
                </div>
                <div className="flex flex-wrap -mx-2">
                  <div className="w-1/2 px-2 mb-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      <b>Branch:</b> {userData?.branch?.branchCode}
                    </p>
                  </div>
                  <div className="w-1/2 px-2 mb-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      <b>Batch:</b> {userData?.batch}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap -mx-2">
                  <div className="w-1/2 px-2 mb-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      <b>Enrolment Id:</b> {userData?.enrolmentNo}
                    </p>
                  </div>
                  <div className="w-1/2 px-2 mb-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {/* <b>Verified By:</b>{" "}
                      {!userData?.verified_by ? (
                        <span className="text-red-600">N/A</span>
                      ) : (
                        <span className="text-green-600">
                          {userData?.verified_by}
                        </span>
                      )} */}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap -mx-2 ">
                  <div className="w-1/2 px-2 mb-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      <b>Gender:</b> {userData?.gender}
                    </p>
                  </div>
                  <div className="w-1/2 px-2 mb-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      <b>DOB:</b> {userData?.formattedDOB}
                    </p>
                  </div>
                </div>
                <div className="w-1/2 px-0 mb-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    <b>Mobie No:</b> {userData?.mobile}
                  </p>
                </div>
                <div className="mb-2"></div> {/* Adjusted spacing */}
              </div>
            )}
            {/* edit details button */}
            <div className="flex flex-wrap w-full justify-between">
              {userData?._id === loggedInUserDetails?._id && (
                <Link
                  to={`/updateUser/${userData?._id}`}
                  className="w-30 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Edit details
                </Link>
              )}

              {/* verify button */}
              {userData?.isAdmin === false &&
              loggedInUserDetails?.isAdmin === true ? (
                <></>
                // <Link
                //   to="/login"
                //   className="w-30 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                // >
                //   Verify User
                // </Link>
              ) : (
                ""
              )}
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserInfoCard;
