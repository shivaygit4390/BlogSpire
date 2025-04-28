import React, { useId } from "react";

function Select({ options = [], label, className = "", ...props }, ref) {
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
      <select
        {...props}
        id={id}
        ref={ref}
        className={`
          w-full px-4 py-2
          border border-slate-300 rounded-lg shadow-sm
          bg-white text-slate-800
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition duration-300
          ${className}
        `}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default React.forwardRef(Select);
