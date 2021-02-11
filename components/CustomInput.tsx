import React from "react";

const CustomInput = (props: any) => {
  return (
    <div className="mt-1">
      <input
        onClick={props.onClick}
        value={props.value}
        type="text"
        name="date"
        id="date"
        className={`${
          false ? "border-red-600" : "border-gray-300"
        } block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 rounded-sm`}
      />
    </div>
  );
};

export default CustomInput;
