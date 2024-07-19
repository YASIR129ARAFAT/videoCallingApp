import React from "react";

function TextArea({
  textVal = "",
  className = "",
  name = "",
  type = "text",
  id = "",
  placeholder = "",
  value = "",
  onClick = () => {
    console.log("onClick function not sent in the props");
  },
  onChange = () => {
    console.log("onChange function not sent in the props");
  },
}) {
  return (
    <textarea
      type={type}
      onChange={onChange}
      name={name}
      id={id}
      className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${className}`}
      placeholder={placeholder}
      value={value}
    />
  );
}

export default TextArea;
