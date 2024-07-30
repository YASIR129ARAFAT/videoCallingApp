import React from "react";
import ProfileCard from "../components/ProfileCard.js";
import Sidebar from "../components/Sidebar.js";
import { useState, useEffect } from "react";
import { getAllDoctors } from "../services/getAllDoctors.services.js";
import { getLoggedInUserDetails } from "../utils/getLoggedInUserDetails.js";
import { useNavigate } from "react-router-dom";
function AllDoctorsPage({ className = "" }) {
  const [allDoctors, setAllDoctors] = useState([]);
  const [loggedInUserDetails, setLoggedInUserDetails] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    async function loadLoggedInUserDetails() {
      try {
        const data = await getLoggedInUserDetails();
        if (data?.success === 0) {
          navigate(`/errorPage/${data?.message}`);
        } else {
          setLoggedInUserDetails(data);
        }
      } catch (error) {
        console.log(error);
        navigate(`/login`);
      }
    }
    loadLoggedInUserDetails();
  }, []);
  useEffect(() => {
    async function loadAllDoctors() {
      try {
        const data = await getAllDoctors();
        // console.log("all admins ");
        // console.log(data);
        if (data?.success === 0) {
          navigate(`/errorPage/${data?.message}`);
        } else {
          setAllDoctors(data);
        }
      } catch (error) {
        console.log(error);
        navigate(`/errorPage/internal error occured`);
      }
    }
    loadAllDoctors();
  }, []);

  return (
    <Sidebar loggedInUserDetails={loggedInUserDetails}>
      <div
        className={`mx-auto justify-center mt-20 bg-red-50 flex flex-row flex-wrap ${className}`}
      >
        {allDoctors.map((ele, ind) => {
          return (
            <ProfileCard
              key={ind}
              userData={ele}
              className="ml-16 mb-4"
            ></ProfileCard>
          );
        })}
      </div>
    </Sidebar>
  );
}

export default AllDoctorsPage;
