import { useEffect, useState } from "react";
import { FaCalendarAlt } from 'react-icons/fa';
import Label from "../components/Label";
import Input from "../components/Input";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import axios from "axios";
import { getLoggedInUserDetails } from "../utils/getLoggedInUserDetails";
function AddAppointmentPage() {
  const [loading, setLoading] = useState(0);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate()
  function handleChange(e) {
    setError("");
    setAppointmentDate(e.target.value);
  }

  const {clientId}  = useParams()

  useEffect(()=>{
    async function setLoggedInUserDetails(){
      try {
        const data = await getLoggedInUserDetails()
        if(data?.userType === "patient"){
          navigate('/errorPage/not authorised')
        }

      } catch (error) {
        console.log(error);
        navigate('/login')
      }
    }
    setLoggedInUserDetails()
  },[])
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(1);

    const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/appointment/addAppointment`,
        {
            apptDate:appointmentDate,
            clientId
        },
        {
            headers:{
                token:localStorage.getItem("token")
            }
        }
    )

    if(res?.data?.success == 1){
        setTimeout(() => {
            setLoading(0);
            if (appointmentDate) {
              alert(`Appointment set for: ${appointmentDate}`);
              setAppointmentDate("");
            } else {
              setError("Please select a date and time for the appointment.");
            }
          }, 3000);
    }
    else{
        setLoading(0)
        // alert("error occured try again")
        setError(res?.data?.errorMessage)
    }

    
    // Here you would typically send the data to your backend
    // For this example, we'll just simulate a delay
    
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <FaCalendarAlt className="text-red-600 text-3xl mr-2" />
          <span className="font-bold text-red-600 text-xl">Appointment</span>
          <span className="font-bold text-gray-700 text-xl">Scheduler</span>
        </div>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Schedule an Appointment
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label
                  htmlFor="appointmentDate"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Appointment Date and Time
                </Label>
                <Input
                  type="datetime-local"
                  onChange={handleChange}
                  name="appointmentDate"
                  id="appointmentDate"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                  value={appointmentDate}
                  required
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">Oops!</span> {error}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 mb-2"
              >
                <div className="flex flex-row justify-center">
                  <Spinner text={"Schedule Appointment"} loading={loading}></Spinner>
                </div>
              </Button>
              <Link to={"/allpatients"} className=" text-red-600">Patients Page</Link>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AddAppointmentPage;