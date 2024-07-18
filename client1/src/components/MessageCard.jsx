import React from "react";
import userPic from "../assets/profile_pic_placeholder.jpeg";
import { Link } from "react-router-dom";

function MessageCard({ className = "", children, obj }) {
  // console.log("obj from message card");
  // console.log(obj);
  return (
    <div
      className={`h-fit mt-4 sm:w-full md:w-[100%] border bg-white rounded-lg p-4 border-blue-100 ${className}`}
    >
      <div className="flex flex-auto items-center">
        <img src={obj?.writer?.image || `https://coenterprises.com.au/wp-content/uploads/2018/02/male-placeholder-image.jpeg`} alt="pic" className="w-8 h-8 rounded-full" />
        <div className="flex flex-row justify-between items-center w-full mx-auto">
          <div>
            <div className="ml-4">{obj?.writer?.name }</div>
            <div className="ml-4 text-xs">
              {obj?.writer?.isAdmin === true ? "Admin" : "Student"}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mr-4">
            <div className="text-xs flex items-center justify-center">
              {obj?.formattedDate}
            </div>
            <div className="text-xs flex items-center justify-center">
              {obj?.formattedTime}
            </div>
          </div>
        </div>
      </div>
      <hr className="mt-2" />
      {obj?.isResultsAnnouncement == 1 ? (
        <div className="mx-auto justify-center overflow-scroll">
          {obj?.content}
        </div>
      ) : (
        <div className="mx-auto justify-center overflow-scroll">
          <div>
            <b>Company: </b>
            {obj?.company}
          </div>
          <div>
            <b>Duration: </b>
            {obj?.duration}
          </div>
          <div>
            <b>Eligibility: </b> {obj?.branches}{" "}
          </div>
          <div>
            <b>Stipend: </b> {obj?.stipend}{" "}
          </div>
          <div>
            <b>Location: </b> {obj?.location}{" "}
          </div>
          <div>
            <b>Form Link: </b>{" "}
            <Link className="text-blue-500" to={obj?.formlink}>
              Here
            </Link>{" "}
          </div>
          <div>
            <b>Deadline: </b> {obj?.deadline}{" "}
          </div>
        </div>
      )}

      <hr className="" />

      {children}
    </div>
  );
}

export default MessageCard;
