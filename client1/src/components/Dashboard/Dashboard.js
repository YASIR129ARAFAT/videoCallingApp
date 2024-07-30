import axios from "axios";
import "./Dashboard.css";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import moment from "moment";
import socketConnection from "../../webRTCutilities/socketConnection";
import proSocketListeners from "../../webRTCutilities/professionalSocketListeners.js";
import { useDispatch } from "react-redux";
import { MdDelete } from "react-icons/md";

import Sidebar from "../Sidebar.js";
import { getLoggedInUserDetails } from "../../utils/getLoggedInUserDetails.js";
const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [apptInfo, setApptInfo] = useState([]);
  const [loggedInUserDetails, setLoggedInUserDetails] = useState({});
  // const [clientToken, setClientToken] = useState(null);
  const [professionalToken, setProfessionalToken] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    async function setData() {
      try {
        const data = await getLoggedInUserDetails();
        setLoggedInUserDetails(data);
        console.log("logged in user: ", data);
      } catch (error) {
        console.log("error in fetching logged in used details", error);
        navigate('/login')
      }
      //   console.log("dd", data);
    }
    setData();
  }, []);

  useEffect(() => {
    async function getToken() {
      if (loggedInUserDetails?.userType === "professional") {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/pro-token2`,
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );
        console.log("pro token: ", res);
        setProfessionalToken(res?.data);
      }

      // console.log("toekn: ", res?.data);
    }
    getToken();
  }, [loggedInUserDetails]);

  useEffect(() => {
    if (loggedInUserDetails?.userType === "professional") {
      const token = professionalToken;
      if (token) {
        try {
          const socket = socketConnection(token);

          proSocketListeners.proDashboardSocketListeners(
            socket,
            setApptInfo,
            dispatch
          );
        } catch (error) {
          console.log("error in getting appointments", error);
        }
      }
    } // here we are listening for apptData event to get the appointments of the professional
  }, [professionalToken]);

  useEffect(() => {
    if (loggedInUserDetails?.userType === "patient") {
      async function getAppointmentsForPatient() {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/appointment/getAllClientAppointments`,
            {
              headers: {
                token: localStorage.getItem("token"),
              },
            }
          );

          // console.log("dfd", res);

          setApptInfo(res?.data?.allAppointments);
        } catch (error) {
          console.log("error in getting appts for patient", error);
        }
      }
      getAppointmentsForPatient();
    }
  }, [loggedInUserDetails]);

  const joinCallClient = async (appt) => {
    // console.log("apptdsdjsbdhs", appt);
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/link2`,
      {
        apptId: appt?._id,
      },
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );

    const token = res?.data?.token;
    console.log("client res token: ", res?.data);
    // console.log(token);
    navigate(
      "/join-video?token=" +
        token +
        "&_id=" +
        appt?._id +
        "&client=" +
        appt?.clientId?.name
    );
  };
  const joinCallProfessional = (appt) => {
    // console.log(appt);
    const token = professionalToken;

    navigate(
      "/join-video-pro?token=" +
        token +
        "&_id=" +
        appt?._id +
        "&client=" +
        appt?.clientId?.name
    );
  };

  const deleteAppointment = async (ele) => {
    try {
      console.log("delet:", ele);
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/appointment/deleteAppointment`,
        {
          _id: ele?._id,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      console.log(res);

      if(res?.data?.success == 1){
        alert("Appointment deleted Successfully")
        const newAppt = apptInfo.filter((obj)=>obj._id !== ele?._id)
        setApptInfo(newAppt);
      }else{
        alert("some error occured.\n Please try again")
      }

    } catch (error) {
      console.log("dd",error);
    }
  };

  return (
    <Sidebar loggedInUserDetails={loggedInUserDetails}>
      <div className=" mt-20 w-[75%] ">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center sticky top-20 z-10 py-4">
          Coming Appointments
        </h1>

        {loggedInUserDetails?.userType === "patient" ? (
          <>
            {apptInfo?.map((ele, ind) => {
              return (
                // <div
                //   key={ind}
                //   className="bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mb-4"
                // >
                //   <li className="client bg-gray-50 m-2 p-4 rounded-md list-none">
                //     <div className="flex flex-col space-y-2">
                //       <div className="flex items-center">
                //         <span className="font-semibold w-20">Patient:</span>
                //         <span>{ele?.clientId?.name}</span>
                //       </div>
                //       <div className="flex items-center">
                //         <span className="font-semibold w-20">Doctor:</span>
                //         <span>{ele?.professionalId?.name}</span>
                //       </div>
                //       <div className="flex items-center">
                //         <span className="font-semibold w-20">Schedule:</span>
                //         <span>
                //           {moment(ele?.apptDate)?.format(
                //             "DD MMMM, YYYY [at] hh:mm A"
                //           )}
                //         </span>
                //       </div>
                //     </div>
                //     <div className="mt-4 text-right">
                //       <button
                //         className="bg-red-500 text-white rounded-md px-6 py-2 hover:bg-red-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                //         onClick={() => {
                //           joinCallClient(ele);
                //         }}
                //       >
                //         Join Call
                //       </button>
                //     </div>
                //   </li>
                // </div>
                <div
                  key={ind}
                  className="bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mb-4"
                >
                  <li className="client bg-gray-50 m-2 p-4 rounded-md list-none">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center">
                        <span className="font-semibold w-20 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-blue-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Patient:
                        </span>
                        <span>{ele?.clientId?.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold w-20 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-green-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                          Doctor:
                        </span>
                        <span>{ele?.professionalId?.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold w-35 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-red-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Schedule:
                        </span>
                        <span>
                          {moment(ele?.apptDate)?.format(
                            "DD MMMM, YYYY [at] hh:mm A"
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 text-right">
                      <button
                        className="bg-red-500 text-white rounded-md px-6 py-2 hover:bg-red-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        onClick={() => {
                          joinCallClient(ele);
                        }}
                      >
                        Join Call
                      </button>
                    </div>
                  </li>
                </div>
              );
            })}
          </>
        ) : (
          <>
            {apptInfo?.map((ele, ind) => {
              return (
                // <div key={ind} className="bg-white rounded">
                //   <li className="client bg-grey m-2 p-2">
                //     Patient: {ele?.clientId?.name} <br />
                //     Doctor: {ele?.professionalId?.name} <br />
                //     Date: {moment(ele?.apptDate)?.format("DD MMMM, YYYY")}
                //     {ele?.waiting && (
                //       <>
                //         <div className="waiting-text d-inline-block">
                //           Waiting
                //         </div>
                //         <button
                //           className="btn btn-danger join-btn"
                //           onClick={() => {
                //             joinCallProfessional(ele);
                //           }}
                //         >
                //           Join
                //         </button>
                //       </>
                //     )}
                //   </li>
                // </div>

                <div
                  key={ind}
                  className="bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mb-4"
                >
                  <li className="client bg-gray-50 m-2 p-4 rounded-md list-none">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center">
                        <span className="font-semibold w-20 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-blue-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Patient:
                        </span>
                        <span>{ele?.clientId?.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold w-20 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-green-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                          Doctor:
                        </span>
                        <span>{ele?.professionalId?.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold w-35 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-red-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Schedule:
                        </span>
                        <span>
                          {moment(ele?.apptDate)?.format(
                            "DD MMMM, YYYY [at] hh:mm A"
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-row justify-between">
                      {ele?.waiting && (
                        <div className="mt-0 flex items-center justify-between">
                          <div className="waiting-text inline-block text-yellow-600 font-semibold flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2 text-yellow-600"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Waiting
                          </div>
                          <div className="flex flex-row m-2">
                            <button
                              className="bg-red-500 text-white rounded-md px-6 py-2 hover:bg-red-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center"
                              onClick={() => {
                                joinCallProfessional(ele);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                              </svg>
                              Join
                            </button>
                          </div>
                        </div>
                      )}

                      <button
                        className="bg-gray-500 text-white rounded-md px-4 py-2 hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex items-center"
                        onClick={() => {
                          // Add your delete functionality here
                          // e.preventDefault();
                          deleteAppointment(ele);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </li>
                </div>
              );
            })}
          </>
        )}
      </div>
    </Sidebar>
  );
};

export default Dashboard;
