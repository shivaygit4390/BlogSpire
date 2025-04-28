import React from "react";
export default function Button({
  children,
  type = "button",
  bgColor = "bg-blue-600",
  textColor = "text-white",
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={` cursor-pointer
        px-5 py-2.5 rounded-lg font-medium text-sm sm:text-base
        transition-all duration-300 ease-in-out
        ${bgColor} ${textColor}
        shadow-md hover:shadow-lg
        hover:opacity-90 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
