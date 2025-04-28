import React, { useId } from "react";

const Input = React.forwardRef(function Input(
  { label, type = "text", className = "", ...props },
  ref
) {
  const id = useId();

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block mb-2 text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        ref={ref}
        className={`
          w-full px-4 py-2
          border border-slate-300 rounded-lg shadow-sm
          text-slate-800 placeholder-slate-400 bg-white
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition duration-300
          ${className}
        `}
        {...props}
      />
    </div>
  );
});

export default Input;
