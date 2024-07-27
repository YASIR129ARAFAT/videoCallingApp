import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoMdDoneAll } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import Spinner from "../components/Spinner";

function ForgotPassword() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [email, setEmail] = useState("");
    const [loading,setLoading]= useState(0);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
        setLoading(1);
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/resetPassword`, {
            email,
        });
        // console.log(res?.data);
        setLoading(0);
      const data = res?.data;
      if (data?.success === 0) {
        setErrorMessage(data?.message)
        setTimeout(()=>{
            setErrorMessage("")
        },6000)
      } else {
        setSuccessMessage("Reset password link sent on your email successfully.")
        setTimeout(()=>{
            setSuccessMessage("")
        },6000)
      }
    } catch (error) {
      console.log(error);
    }
  }
  function handleChange(e) {
    setEmail(e.target.value);
  }
  return (
    <>
      {successMessage !== "" && (
        <p className=" sticky bg-green-100 w-full p-2 flex flex-row text-black dark:text-black">
          <IoMdDoneAll size={20} color="green" />
          {successMessage}
        </p>
      )}
      {errorMessage !== "" && (
        <p className="mt-2 p-2 text-sm text-red-600">
          <span className="font-medium flex flex-row"><RxCross2 size={20} color="red" /></span> {errorMessage}
        </p>
      )}

      <main
        id="content"
        role="main"
        className="w-full mt-[10%] max-w-md mx-auto p-6"
      >
        <div className="mt-7 bg-white  rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                Forgot password?
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Remember your password?
                <Link
                  className="text-red-600 decoration-2 hover:underline font-medium"
                  to={"/login"}
                >
                  Login here
                </Link>
              </p>
            </div>

            <div className="mt-5">
              <form>
                <div className="grid gap-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                    >
                      Email address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-red-500 focus:ring-red-500 shadow-sm"
                        required
                        aria-describedby="email-error"
                        value={email}
                        onChange={handleChange}
                      />
                    </div>
                    <p
                      className="hidden text-xs text-red-600 mt-2"
                      id="email-error"
                    >
                      Please include a valid email address so we can get back to
                      you
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                    onClick={handleSubmit}
                  >
                    
                    <Spinner text="Reset Password" loading={loading}></Spinner>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <p className="mt-3 flex justify-center items-center text-center divide-x divide-gray-300 text-gray-700 text-sm">
          A password reset link will be emailed to you.
        </p>
      </main>
    </>
  );
}

export default ForgotPassword;
