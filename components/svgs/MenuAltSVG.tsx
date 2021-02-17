import React from 'react'

const MenuAltSVG = ({customClasses = ""}) => {
    return (
        <svg
        className={`h-6 w-6 ${customClasses}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 6h16M4 12h8m-8 6h16"
        />
      </svg>
    )
}

export default MenuAltSVG
