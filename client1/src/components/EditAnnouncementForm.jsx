import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
// import {
//   handleChange,
//   handleClick,
// } from "../handlers/editAnnouncementForm.handler";
function EditAnnouncementForm({ announcement,handleChange,handleClick }) {
  const [formContent, setFormContent] = useState("");
    const navigate = useNavigate()
  useEffect(() => {
    setFormContent(announcement?.content);
  }, [announcement]);

  return (
    <form
      className="flex flex-col items-center mx-auto w-[70%] mt-[10%]"
      action=""
    >
      <label
        for="message"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Announcement
      </label>
      <textarea
        id="announcement_content"
        rows="4"
        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        value={formContent}
        onChange={(e) => {
          handleChange(e, setFormContent);
        }}
      ></textarea>
      <Button
        type={"submit"}
        onClick={(e) => {
          handleClick(e, formContent,announcement,navigate);
        }}
        className="mt-4"
      >
        Update
      </Button>
    </form>
  );
}

export default EditAnnouncementForm;
