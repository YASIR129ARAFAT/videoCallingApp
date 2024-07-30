import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();
    const {message} = useParams()
  const handleClick = () => {
    navigate('/dashboard'); // Replace '/' with the desired path
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Error occured</h1>
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-300"
          onClick={handleClick}
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;