import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoReturnDownBack } from "react-icons/io5";

import Sidebar from "../components/Sidebar.js";

import { getLoggedInUserDetails } from "../utils/getLoggedInUserDetails.js";

import {
  handleSubmit,
  handleChange,
} from "../handlers/changePasswordPage.handler.js";

function ChangePasswordPage() {
  let navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [formVal, setFormVal] = useState({
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [error, setError] = useState({
    passwordError: "",
    newPasswordError: "",
    confirmNewPasswordError: "",
    otherError: "",
  });

  const [loggedInUserDetails, setLoggedInUserDetails] = useState({});

  useEffect(() => {
    async function loadLoggedInUserDetails() {

      try {
        const data = await getLoggedInUserDetails();
        setLoggedInUserDetails(data);
      } catch (error) {
        console.log(error);
        navigate('/login')
      }
    }
    loadLoggedInUserDetails();

  }, []);
  return (
    <Sidebar loggedInUserDetails={loggedInUserDetails} className="">
      <div className="w-full mt-20">
        <div className="mb-10 ml-4">
          <Link className="rounded-2xl m-2 p-2 " to={`/userprofile`}>
            <IoReturnDownBack className=" size-5 hover:text-white  hover:bg-red-700 rounded-md" />
          </Link>
        </div>
        <div className="flex flex-col mb-2 items-center text-green-500 text-sm">
          <span>{message !== "" && message}</span>
        </div>
        <div className="flex flex-col items-center mb-10 text-2xl text-red-800">
          Change Your Password
        </div>
        <form className="max-w-sm mx-auto">
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your Current Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              placeholder="Current Password..."
              value={formVal?.password}
              onChange={(e) => {
                handleChange(e, setError, setFormVal);
              }}
            />
            {error?.passwordError !== "" && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                <span className="font-medium">Oops!</span>{" "}
                {error?.passwordError}
              </p>
            )}
          </div>
          <div className="mb-5">
            <label
              htmlFor="newPassword"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              value={formVal?.newPassword}
              onChange={(e) => {
                handleChange(e, setError, setFormVal);
              }}
              placeholder="New password"
            />
            {error?.newPasswordError !== "" && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                <span className="font-medium">Oops!</span>{" "}
                {error?.newPasswordError}
              </p>
            )}
          </div>
          <div className="mb-5">
            <label
              htmlFor="confirmNewPassword"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Re-enter New Password
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              value={formVal?.confirmNewPassword}
              placeholder="Confirm New Password"
              onChange={(e) => {
                handleChange(e, setError, setFormVal);
              }}
            />
            {error?.confirmNewPasswordError !== "" && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                <span className="font-medium">Oops!</span>{" "}
                {error?.confirmNewPasswordError}
              </p>
            )}
          </div>
          <div>
            {error?.otherError !== "" && (
              <p className=" mb-2 text-xs text-red-600 dark:text-red-500">
                {error?.otherError}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            onClick={(e) => {
              handleSubmit(e, formVal, setError, setMessage, navigate);
            }}
          >
            Change Password
          </button>
        </form>
      </div>
    </Sidebar>
  );
}
export default ChangePasswordPage;
