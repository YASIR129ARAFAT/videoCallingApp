import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Label from "../components/Label";
import Input from "../components/Input";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import {FaHeartbeat } from 'react-icons/fa';

function LoginPage() {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(0);
  const [formVal, setFormVal] = useState({
    email: "",
    password: "",
    // userType: "patient",
  });
  const [error, setError] = useState({
    emailError: "",
    passwordError: "",
    // userTypeError: "",
    otherError: "",
  });
  function handleChange(e) {
    // console.log(formVal);
    const name = e.target.name + "Error";
    // console.log(name);
    setError({ ...error, [name]: "", otherError: "" });
    setFormVal({ ...formVal, [e.target.name]: e.target.value });
    // console.log(formVal);
  }
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(1);
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/login`,
        formVal
      );
      setLoading(0);

      setFormVal({ email: "", password: "" });
      setError({ ...error, ...res.data.error });
      // window.location.href = `http://localhost:5173/allannouncements`
      if (res?.data?.success === 1) {
        localStorage.setItem("token", res.data?.user?.token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link
          to="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
        <FaHeartbeat className="text-red-600 text-3xl mr-2" />
        <span className="font-bold text-red-600 text-xl">Tele</span>
        <span className="font-bold text-gray-700 text-xl">Care</span>
        </Link>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  textVal="Your email"
                >
                  Your email
                </Label>
                <Input
                  type="text"
                  onChange={handleChange}
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                  placeholder="name@company.com"
                  value={formVal.email}
                />
                {error.emailError !== "" && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">Oops!</span>{" "}
                    {error.emailError}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  textVal="Password"
                >
                  Password
                </Label>
                <Input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                  value={formVal.password}
                />
                {error.passwordError !== "" && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">Oops!</span>{" "}
                    {error.passwordError}
                  </p>
                )}
              </div>

              {/* userType */}
              {/*
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
                  value={formVal.userType}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                >
                  <option defaultValue="patient">patient</option>
                  <option value="professional">Doctor</option>
                </select>
                {error.userTypeError !== "" && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">Oops!</span>{" "}
                    {error.userTypeError}
                  </p>
                )}
              </div>
                
                */}

              <div className="">
                {/* <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <Input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-red-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-red-600 dark:ring-offset-gray-800"
                      required=""
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <Label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                      textVal="Your email"
                    >
                      Remember me
                    </Label>
                  </div>
                </div> */}
                <Link
                  to={'/forgotPassword'}
                  className="text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                onClick={handleSubmit}
                className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
              >
                <div className="flex flex-row justify-center">
                  <Spinner text={"Sign in"} loading={loading}></Spinner>
                </div>
              </Button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <Link
                  to="/register"
                  className="font-medium text-red-600 hover:underline dark:text-red-500"
                >
                  Sign up
                </Link>
              </p>
            </form>
            {error.otherError !== "" && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                <span className="font-medium">Oops!</span> {error.otherError}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
export default LoginPage;
