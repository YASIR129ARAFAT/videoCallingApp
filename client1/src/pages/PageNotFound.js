import React from "react";
import { Link, useParams } from "react-router-dom";

function PageNotFound() {
  const { message } = useParams();

  return (
    <section className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center">
          <h1 className="mb-4 text-7xl font-extrabold text-red-600">
            404
          </h1>
          <p className="mb-4 text-3xl font-bold text-gray-900">
            Something's missing.
          </p>
          <p className="mb-6 text-lg text-gray-700">
            {message || "Sorry, we can't find that page. You'll find lots to explore on the home page."}
          </p>
          <div className="space-y-4">
            <Link
              to={'/'}
              className="block w-full bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors duration-300"
            >
              Back to Login
            </Link>
            <Link
              to={'/dashboard'}
              className="block w-full bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors duration-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PageNotFound;