import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.js";
import UserInfoCard from "../components/UserInfoCard.js";

import { getLoggedInUserDetails } from "../utils/getLoggedInUserDetails.js";
import { Navigate, useNavigate } from "react-router-dom";
function UserProfilePage() {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate()
  useEffect(() => {
    async function setData() {
      try {
        const data = await getLoggedInUserDetails();
        setUserData(data);
      } catch (error) {
        console.log(error);
        navigate("/login")
      }
    }
    setData();
  }, []);
  return (
    <>
      <Sidebar loggedInUserDetails={userData}>
        <UserInfoCard userData={userData}>
        </UserInfoCard>
      </Sidebar>
    </>
  );
}

export default UserProfilePage;
