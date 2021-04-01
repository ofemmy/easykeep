import React from "react";

const SectionHeading = ({ text,customClasses="" }) => {
  return (
    <div className={`relative max-w-6xl ${customClasses}`}>
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
