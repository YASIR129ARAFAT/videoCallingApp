import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserDoctor } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";
import {
  FaUser,
  FaUsers,
  FaBell,
  FaHeartbeat,
  FaSignOutAlt,
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
} from "react-icons/fa";

function Sidebar({ children = "", loggedInUserDetails = {} }) {
  const location = useLocation();
  const sidebarUncollapsedText = [
    "My Profile",
    "Appointments",
    "All Patients",
    "Doctors",
    "Update Password"
  ];
  const correspondingPaths = [
    "/userprofile",
    "/dashboard",
    "/allpatients",
    "/alldoctors",
    `/changePassword`
  ];
  const sidebarCollapsedText = [
    <FaUser />,
    <FaBell />,
    <FaUsers/>,
    <FaUserDoctor />,
    <IoIosSettings/>

  ];
  const [sidebarText, setSidebarText] = useState(sidebarCollapsedText);
  const [isCollapsed, setIsCollapsed] = useState(1);
  const handleClick = () => {
    setIsCollapsed((prev) => 1-prev);
    if (isCollapsed===0) setSidebarText(sidebarCollapsedText);
    else setSidebarText(sidebarUncollapsedText);
  };

  let navigate = useNavigate();
  const clickLogout = async (e) => {
    e.preventDefault();
    try {
      localStorage.setItem("token", null);
      navigate("/login");
      alert("logged out successfull");
    } catch (error) {
      console.log("logout error", error);
    }
  };

  return (
    <>
      <nav className="border-b-2 h-20 border-red-700 fixed top-0 left-0 right-0 bg-white dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            to={`/dashboard`}
            className="flex items-center rtl:space-x-reverse"
          >
            <FaHeartbeat className="text-red-600 text-3xl mr-2" />
            <span className="font-bold text-red-600 text-xl">Tele</span>
            <span className="font-bold text-gray-700 text-xl">Care</span>
          </Link>

          <div className="flex flex-row items-center space-x-3">
            <span
              className=" text-gray-900 rounded hover:bg-red-700 hover:text-white dark:text-white dark:hover:text-red-500 sm:inline"
            >
              {loggedInUserDetails?.name}
            </span>

            <img
              className="w-12 h-12 flex rounded-full items-center justify-center border-2 border-red-700"
              src={loggedInUserDetails?.image || `https://coenterprises.com.au/wp-content/uploads/2018/02/male-placeholder-image.jpeg`}
              alt="profile pic"
            />
          </div>
        </div>
      </nav>

      <div className="w-full h-full flex bg-red-50">
        <div
          className={`overflow-y-auto border-r-2 mt-20 overflow-hidden h-screen border-red-700 bg-white ${
            isCollapsed === 1 ? "w-[10%]" : "w-[20%]"
          }`}
        >
          <Link
            onClick={handleClick}
            className="mt-2 text-black overflow-hidden py-3 w-full flex justify-center text-center rounded-xl hover:bg-red-500 hover:text-white "
          >
            {isCollapsed === 0 ? (
              <FaArrowAltCircleLeft className="h-4 w-4" />
            ) : (
              <FaArrowAltCircleRight className="h-4 w-4" />
            )}
          </Link>

          <div className="pt-48 w-full flex flex-col flex-grow">
            <hr />
            {sidebarText.map((ele, ind) => {
              const path = correspondingPaths[ind];

              return (
                <div key={path}>
                  <Link to={path} key={path}>
                    <div
                      className={`overflow-hidden py-3 w-full text-center rounded-xl hover:bg-red-500 hover:text-white flex justify-center ${
                        location.pathname === path
                          ? "bg-red-500 text-white "
                          : ""
                      }`}
                    >
                      {ele}
                    </div>
                  </Link>
                  <hr />
                </div>
              );
            })}
            

            {/* sign out button */}
            <>
              <button onClick={clickLogout} key={"/signout"}>
                <div
                  className={`overflow-hidden py-3 w-full text-center rounded-xl hover:bg-red-500 hover:text-white flex justify-center `}
                >
                  {isCollapsed === 1 ? <FaSignOutAlt /> : "sign-out"}
                </div>
              </button>
              <hr />
            </>
          </div>
        </div>

        <div
          className={`md:w-full sm:w-full bg-red-50 p-4 h-screen ${
            isCollapsed === 1 ? "w-[90%]" : "w-[80%]"
          } overflow-y-auto `}
        >
          <div className="flex flex-col w-full items-center justify-center">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
