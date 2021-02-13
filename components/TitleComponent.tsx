import React from "react";

const TitleComponent = ({value}) => {
  return (
    <div className="flex">
      <a href="#" className="group inline-flex space-x-2 truncate text-sm">
        <svg
          className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-gray-500 truncate group-hover:text-gray-900">
         {value}
        </p>
      </a>
    </div>
  );
};

export default TitleComponent;
