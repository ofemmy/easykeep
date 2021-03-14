import React from "react";
import CloseSVG from "./svgs/CloseSVG";

const Banner = ({ message, color }) => {
  return (
    <div className={`relative bg-${color}-400`}>
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="pr-16 sm:text-center sm:px-16">
          <p className="font-medium text-red-50">
            <span className="hidden md:inline">{message}</span>
          </p>
        </div>
        <div className="absolute inset-y-0 right-0 pt-1 pr-1 flex items-start sm:pt-1 sm:pr-2 sm:items-start">
          <button
            type="button"
            className="flex p-2 rounded-md hover:bg-white focus:outline-none focus:ring-2 focus:ring-white"
          >
            <span className="sr-only">Dismiss</span>
            <div className="text-white hover:text-red-600">
              <CloseSVG />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
