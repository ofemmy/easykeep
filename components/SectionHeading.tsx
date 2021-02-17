import React from "react";

const SectionHeading = ({ text }) => {
  return (
    <div className="relative my-4 max-w-6xl mx-auto px-4">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
      </div>
      <div className="relative flex justify-start">
        <span className="pr-3 bg-gray-100 text-lg font-medium text-gray-900">
          {text}
        </span>
      </div>
    </div>
  );
};

export default SectionHeading;
