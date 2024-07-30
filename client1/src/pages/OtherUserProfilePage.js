import React, { useEffect, useState } from "react";
import { IoReturnDownBack } from "react-icons/io5";

import Sidebar from "../components/Sidebar.js";
import { getLoggedInUserDetails } from "../utils/getLoggedInUserDetails.js";
import { getUserData } from "../services/getUserData.services.js";
import { useNavigate,Navigate, useParams } from "react-router-dom";
import UserInfoCard from "../components/UserInfoCard.js";
import { Link } from "react-router-dom";

function OtherUserProfilePage() {
  const [loggedInUserDetails, setLoggedInUserDetails] = useState({});
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  const { id } = useParams();
  useEffect(() => {
    async function setData() {
      try {
        let data = await getLoggedInUserDetails();
        setLoggedInUserDetails(data);
        // console.log(data);

        // id of the user whose profile you want to view
        // console.log(id);
        const data2 = await getUserData(id);
        // console.log(data2);
        setUserData(data2);
      } catch (error) {
        console.log(error);
        navigate('/login')
      }
    }
    setData();
  }, []);
  return (
    <Sidebar loggedInUserDetails={loggedInUserDetails} >
      <div className="w-full">
        
        <Link
            className="rounded-2xl m-2 p-2 "
            to={`/alluser`}
          >
            <IoReturnDownBack className=" size-5 hover:text-white  hover:bg-red-700 rounded-md" />
          </Link>
        <UserInfoCard userData={userData}></UserInfoCard>
      </div>
    </Sidebar>
  );
}

export default OtherUserProfilePage;
