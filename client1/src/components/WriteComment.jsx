import React, { useState } from "react";

import TextArea from "./TextArea.jsx";
import Button from "./Button.jsx";

function WriteComment({ className = "",value,setValue, handleClick }) {
  const handleChange = (e) => {
    setValue(`${e.target.value}`);
  };
  return (
    <div
      className={`mt-2 p-0 h-full flex flex-row bg-white justify-between items-center rounded-lg border border-gray-600 ${className}`}
    >
      <TextArea
        type="textarea"
        placeholder="Write a comment ..."
        className="border-none  h-full rounded-full rounded-r-none bg-white ml-2 focus:outline-none mr-0 flex-grow"
        value={value}
        onChange={handleChange}
      ></TextArea>
      <Button
        type="submit"
        onClick={handleClick}
        className="h-fit text-black w-10 focus:outline-none p-0 m-0 rounded-full rounded-l-none bg-white mr-2 hover:bg-white"
      >
        <p className="text-black h-full text-center flex justify-center">
          Send
        </p>
      </Button>
    </div>
  );
}

export default WriteComment;
