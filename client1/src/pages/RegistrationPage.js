import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { IoMdDoneAll } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import {
  initialRegistrationErrorMessage,
  initialRegistrationFormData,
} from "../utils/initialStates.js";
import {FaHeartbeat } from 'react-icons/fa';

import Input from "../components/Input.js";
import Label from "../components/Label.js";
import Button from "../components/Button.js";

import Spinner from "../components/Spinner.js";

function RegistrationPage() {
  const [errorMessage, setErrorMessage] = useState(
    initialRegistrationErrorMessage
  );
  const [formData, setFormData] = useState(initialRegistrationFormData);
  const [successMessage, setSuccessMessage] = useState("");
  const [generalErrorMessage, setGeneralErrorMessage] = useState("");
  const [loading, setLoading] = useState(0);


  async function handleSubmit(e) {
    e.preventDefault();
    try {
      console.log("inside");
      setLoading(1);
      console.log("url: ",`${process.env.REACT_APP_BACKEND_URL}/auth/signup`);
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/signup`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      setLoading(0);
      // console.log(res?.data);
      console.log(errorMessage);

      setErrorMessage({ ...errorMessage, ...res?.data?.error });
      // setFormData(initialRegistrationFormData);

      if (res?.data?.successMessage) {
        // console.log(res.data.successMessage)
        setSuccessMessage("User registrated succesfully!!");
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);

      }

      console.log(res);
    } catch (error) {
      console.log("error from log:", error);
      setGeneralErrorMessage(
        error?.response?.data?.message || "Internal Server Error!!"
      );
      setTimeout(() => {
        setGeneralErrorMessage("");
      }, 6000);
      setLoading(0);
    }
  }

  const handleChange = (e) => {
    // console.log("formData");
    // console.log(formData);

    setFormData({ ...formData, [e.target.name]: e.target.value });

    const new_key = e.target.name + "Error";
    setErrorMessage({ ...errorMessage, [new_key]: "" });
  };

  return (
    <section className="w-full pt-0 bg-white-50 dark:bg-gray-900">
      {successMessage !== "" && (
        <p className=" sticky top-0 bg-green-200 w-full p-2 flex flex-row text-black dark:text-black">
          <IoMdDoneAll size={20} color="green" />
          {successMessage}
        </p>
      )}
      {generalErrorMessage !== "" && (
        <p className=" sticky top-0 bg-red-200 w-full p-2 flex flex-row text-black dark:text-black">
          <RxCross2 size={20} color="red" />
          {generalErrorMessage}
        </p>
      )}
      {/* <div className="mb-10 ml-4">
        <Link className="rounded-2xl m-2 p-2 " to={`/userprofile`}>
          <IoReturnDownBack className=" size-5 hover:text-white  hover:bg-red-700 rounded-md" />
        </Link>
      </div> */}

      <div className="w-full mt-10 flex flex-col items-center justify-center px-6 py-8 mx-auto md:min-h-max lg:py-0">
        <Link
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
        <FaHeartbeat className="text-red-600 text-3xl mr-2" />
        <span className="font-bold text-red-600 text-xl">Tele</span>
        <span className="font-bold text-gray-700 text-xl">Care</span>
        </Link>

        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              {/* email */}
              <div>
                <Label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                  placeholder="name@company.com"
                  required=""
                />
                {errorMessage.emailError !== "" && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">Oops!</span>{" "}
                    {errorMessage.emailError}
                  </p>
                )}
              </div>

              {/* fullname */}
              <div>
                <Label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Full Name
                </Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                  placeholder="John Doe"
                />
                {errorMessage.nameError !== "" && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">Oops!</span>{" "}
                    {errorMessage.nameError}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <Label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                  placeholder="......"
                />
                {errorMessage.passwordError !== "" && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">Oops!</span>{" "}
                    {errorMessage.passwordError}
                  </p>
                )}
              </div>

              {/* confirm Password */}
              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  PasswConfirm Password
                </Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                  placeholder="......"
                />
                {errorMessage.confirmPasswordError !== "" && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">Oops!</span>{" "}
                    {errorMessage.confirmPasswordError}
                  </p>
                )}
              </div>

              {/* mobile  */}
              <div>
                <Label
                  htmlFor="mobile"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Mobile Number
                </Label>
                <Input
                  type="text"
                  name="mobile"
                  id="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="eg. 7382976363"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                />
                {errorMessage.mobileError !== "" && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">Oops!</span>{" "}
                    {errorMessage.mobileError}
                  </p>
                )}
              </div>

              {/* userType */}
              <div>
                <label
                  htmlFor="userType"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  User Type
                </label>
                <select
                  id="userType"
                  name="userType"
                  onChange={handleChange}
                  value={formData.userType}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                >
                  <option defaultValue="patient">Patient</option>
                  <option value="professional">Doctor</option>
                </select>
                {errorMessage.userTypeError !== "" && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">Oops!</span>{" "}
                    {errorMessage.userTypeError}
                  </p>
                )}
              </div>

              {/* dob */}
              <div>
                <Label
                  htmlFor="dob"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Date of Birth
                </Label>
                <Input
                  type="date"
                  name="dob"
                  id="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                  placeholder="DOB"
                />
                {errorMessage.dobError !== "" && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">Oops!</span>{" "}
                    {errorMessage.dobError}
                  </p>
                )}
              </div>

              {/* gender */}
              <div>
                <label
                  htmlFor="gender"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  onChange={handleChange}
                  value={formData.gender}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                >
                  <option defaultValue="prefer not to say">
                    prefer not to say
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errorMessage.genderError !== "" && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">Oops!</span>{" "}
                    {errorMessage.genderError}
                  </p>
                )}
              </div>

              {/* image */}
              {/* <div className="max-w-lg mx-auto">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="user_avatar"
                >
                  Upload Profile pic..
                </label>
                <Input
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  aria-describedby="user_avatar_help"
                  id="image"
                  name="image"
                  type="file"
                  accept='image/*, .png' // /* means any type of image but .png is not present in it so we need to incklude it separately
                  value={formData.image}
                  onChange={handleChange}
                />
                <div
                  className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                  id="user_avatar_help"
                >
                  Add profile picture
                </div>
              </div> */}

              <Button
                type="submit"
                className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
              >
                <div className="flex flex-row justify-center">
                  <Spinner
                    text={"Create an Account"}
                    loading={loading}
                  ></Spinner>
                </div>
              </Button>

              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-red-600 hover:underline dark:text-red-500"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RegistrationPage;
