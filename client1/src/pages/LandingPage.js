import React from "react";
import { Link } from "react-router-dom";
import { FaVideo, FaCalendarAlt, FaUserMd, FaHeartbeat } from "react-icons/fa";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex space-x-7">
              <Link to="/" className="flex items-center py-4 px-2">
                <div className="flex items-center">
                  <FaHeartbeat className="text-red-600 text-3xl mr-2" />
                  <span className="font-bold text-red-600 text-xl">Tele</span>
                  <span className="font-bold text-gray-700 text-xl">Care</span>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="py-2 px-4 font-medium text-gray-500 rounded hover:bg-red-500 hover:text-white transition duration-300"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="py-2 px-4 font-medium text-white bg-red-500 rounded hover:bg-red-600 transition duration-300"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto mt-10 px-4">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Healthcare at Your Fingertips
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with top doctors through secure video consultations, anytime
            and anywhere.
          </p>
          <Link
            to="/register"
            className="bg-red-500 text-white font-bold py-3 px-8 rounded-full hover:bg-red-600 transition duration-300 text-lg"
          >
            Start Your Journey
          </Link>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-10">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300">
            <FaVideo className="text-red-500 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Video Consultations</h3>
            <p className="text-gray-600">
              Face-to-face interactions from the comfort of your home
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300">
            <FaCalendarAlt className="text-red-500 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Easy Scheduling</h3>
            <p className="text-gray-600">
              Doctors can efficiently manage and schedule appointments
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300">
            <FaUserMd className="text-red-500 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Expert Doctors</h3>
            <p className="text-gray-600">
              Access to a network of qualified medical professionals
            </p>
          </div>
        </div>

        <div className="mt-20 flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:w-1/2">
            <img
              src="https://img.freepik.com/free-photo/doctor-with-stethoscope-hands-hospital-background_1423-1.jpg"
              alt="Telemedicine Illustration"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:w-1/2 p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Why Choose TeleCare?
            </h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <FaHeartbeat className="text-red-500 mr-2" />
                24/7 access to medical professionals
              </li>
              <li className="flex items-center">
                <FaHeartbeat className="text-red-500 mr-2" />
                Secure and confidential video consultations
              </li>
              <li className="flex items-center">
                <FaHeartbeat className="text-red-500 mr-2" />
                Convenient and time-saving
              </li>
              <li className="flex items-center">
                <FaHeartbeat className="text-red-500 mr-2" />
                Accessible from anywhere with internet connection
              </li>
              <li className="flex items-center">
                <FaHeartbeat className="text-red-500 mr-2" />
                Reduced exposure to other patients
              </li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white mt-20 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center mb-4">
            <FaHeartbeat className="text-red-500 text-2xl mr-2" />
            <span className="font-bold text-xl">TeleCare</span>
          </div>
          <p>&copy; 2024 TeleCare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
