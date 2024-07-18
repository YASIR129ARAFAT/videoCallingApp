import React from "react";
import userPic from "../assets/profile_pic_placeholder.jpeg";
import { Link } from "react-router-dom";

function SingleOpening({ className = "", children, obj }) {
  return (
    <div
      className={`h-fit mt-4 sm:w-full md:w-[100%] border bg-white rounded-lg p-4 border-blue-100 ${className}`}
    >
      <div className="flex flex-auto items-center">
        <img src={obj?.announcer?.image || `https://coenterprises.com.au/wp-content/uploads/2018/02/male-placeholder-image.jpeg`} alt="pic" className="w-8 h-8 rounded-full" />
        <div className="flex flex-row justify-between items-center w-full mx-auto">
          <div>
            <div className="ml-4">{obj?.announcer?.name}</div>
            <div className="ml-4 text-xs">{obj?.announcer?.userType}</div>
          </div>
          <div className="flex flex-col items-center justify-center mr-4">
            <div className="text-xs flex items-center justify-center">
              {obj?.formattedUpdateDate}
            </div>
            <div className="text-xs flex items-center justify-center">
              {obj?.formattedUpdateTime}
            </div>
          </div>
        </div>
      </div>
      <hr className="mt-2" />
      <div className="mx-auto justify-center overflow-scroll">
        <div>
          <b>Company: </b>
          {obj?.companyName}
        </div>
        <div>
          <b>Offer Type: </b>
          {obj?.offerType}
        </div>

        {obj?.fullTime && (
          <div className="mt-2 mb-2">
            <div>
              <b className="text-blue-700">Full-Time offer Details</b>
            </div>
            <div className="ml-4">
              <b>CTC: </b>
              {obj?.fullTime?.ctc} LPA
            </div>
          </div>
        )}

        {obj?.internship && (
          <div className="mt-2 mb-2">
            <div>
              <b className="text-blue-700">Internship Details</b>
            </div>
            <div className="ml-4">
              <div>
                <b>Stipend: </b>
                {obj?.internship?.stipendPerMonth} per month
              </div>
              <div>
                <b>Duration: </b>
                {obj?.internship?.duration} months
              </div>
            </div>
          </div>
        )}

        {obj?.cgpaCriteria?.length !== 0 ? (
          <div className="mt-2 mb-2">
            <b className="text-blue-700">CGPA Criteria</b>
            {obj?.cgpaCriteria?.map((ele) => {
              return (
                <div key={obj?._id} className="ml-4">
                  <span>
                    <b>Branch:</b> {ele?.branch}
                  </span>
                  <span className="ml-4">
                    <b>Cgpa:</b> {ele?.cgpa}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          ""
        )}
        <div>
          <b>Location: </b> {obj?.location}{" "}
        </div>
        <div>
          <b>Branches Allowed: </b>
          {obj?.branchesAllowed?.join(", ")}
        </div>
        <div>
          <b>Application Deadline: </b> {obj?.formattedApplicationDeadlineDate}
          {", "}
          {obj?.formattedApplicationDeadlineTime}
        </div>
        {obj?.formattedTestDate && (
          <div>
            <b>Test Timings: </b> {obj?.formattedTestDate}
            {", "}
            {obj?.formattedTestTime}
          </div>
        )}
        <div>
          <b>Form Link: </b>{" "}
          <Link to={obj?.formLink} target="_blank" className="text-blue-600">
            Apply Here
          </Link>
          {/* target _blank will open the link in new tab */}
        </div>
        {obj?.additionalInfo === "" ? (
          ""
        ) : (
          <div>
            <b>Additional Info: </b> {obj?.additionalInfo}
          </div>
        )}
      </div>
      <hr className="mt-2" />
      {children}
    </div>
  );
}

export default SingleOpening;
