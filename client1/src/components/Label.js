import React, { Children } from "react";

function Label({
    htmlFor = "",
    className = "",
    textVal = "",
    children=""
    
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-gray-500 dark:text-gray-300 + ${className}`}
    >{children}</label>
  );
}

export default Label;
