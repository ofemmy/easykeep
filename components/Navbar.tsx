import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import MenuAltSVG from "./svgs/MenuAltSVG";
import { Avatar } from "@chakra-ui/react";
import { MyAppContext } from "../store";
import axios from "axios";

const Navbar = () => {
  const [show, setShow] = useState(true);
  const router = useRouter();
 const {month,setMonth,user} = useContext(MyAppContext)
  async function handleLogout() {
    const response = await axios("/api/logout", { method: "POST" });
    if (response.status==200) {
      router.push("/login");
    }
  }
  {
  }
  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:border-none justify-between lg:justify-end">
      <button className="px-4 border-r border-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-100 lg:hidden">
        <span className="sr-only">Open sidebar</span>
        <MenuAltSVG />
      </button>
      <div className="relative lg:p-2 py-4 px-2 mr-3">
        <div>
          <button
            className="max-w-xs bg-white rounded-full flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 lg:p-2 lg:rounded-md lg:hover:bg-gray-100"
            id="user-menu"
            aria-haspopup="true"
            onClick={() => setShow(!show)}
          >
            {/* <img
              className="h-8 w-8 rounded-full"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            /> */}
            <Avatar size="sm" name={user.name}/>
            <span className="hidden ml-3 text-gray-700 text-sm font-medium lg:block">
              <span className="sr-only">Open user menu for </span>{user.name}
            </span>
            <svg
              className="hidden flex-shrink-0 ml-1 h-5 w-5 text-gray-400 lg:block"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div
          className={`${
            show ? "hidden" : ""
          } origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg  bg-white ring-1 ring-black ring-opacity-5`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu"
        >
          <button
            className="block px-4 py-4 text-sm text-gray-700 hover:bg-gray-100 w-full"
            role="menuitem"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
