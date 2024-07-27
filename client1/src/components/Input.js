import React from "react";

function Input({
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
    <input
      type={type}
      onChange={onChange}
      name={name}
      id={id}
      className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500 ${className}`}
      placeholder={placeholder}
      value={value}
    />
  );
}

export default Input;
