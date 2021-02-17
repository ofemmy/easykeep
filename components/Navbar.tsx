import React, { useContext, useState,useRef } from "react";
import { useRouter } from "next/router";
import MenuAltSVG from "./svgs/MenuAltSVG";
import { Avatar } from "@chakra-ui/react";
import { MyAppContext } from "../store";
import {Transition } from "@headlessui/react"
import axios from "axios";
import useClickOutside from "../lib/useClickOutside";
const Navbar = () => {
  const [show, setShow] = useState(false);
  const logOutBoxRef = useRef();
  const closeBox=()=>{setShow(false);};
  useClickOutside(logOutBoxRef, closeBox);
  const router = useRouter();
 const {user,setSidebarOpen} = useContext(MyAppContext)
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
      
     <button className=" hidden md:block px-4 border-r border-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-100 lg:hidden"
     onClick={()=>setSidebarOpen(true)}
     >
        <span className="sr-only">Open sidebar</span>
        <MenuAltSVG />
      </button>
      <div className="flex items-center justify-center flex-shrink-0 px-4">
        <h2 className="md:hidden text-2xl font-extrabold text-gray-700 sm:text-3xl sm:tracking-tight lg:text-4xl">geldTrack</h2>
      </div>
 
      <div className="relative lg:p-2 py-4 px-2 mr-3">
        <div>
          <button
          ref = {logOutBoxRef}
            className="max-w-xs bg-white rounded-full flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 lg:p-2 lg:rounded-md lg:hover:bg-gray-100"
            id="user-menu"
            aria-haspopup="true"
            onClick={() => setShow(!show)}
          >
           
            <Avatar size="sm" name={user?String(user.name):""} bg="orange.500"/>
            <span className="hidden ml-3 text-gray-700 text-sm font-medium lg:block">
              <span className="sr-only">Open user menu for </span>{user?user.name:""}
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
        <Transition show={show}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        >
          {(ref)=>(
             <div
             className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg  bg-white ring-1 ring-black ring-opacity-5"
             role="menu"
             aria-orientation="vertical"
             aria-labelledby="user-menu"
           >
             <button
               className="block px-4 py-4 text-sm  font-medium text-red-700 hover:bg-gray-100 w-full"
               role="menuitem"
               onClick={handleLogout}
             >
               Logout
             </button>
           </div>
          )}
        </Transition>
       
      </div>
    </div>
  );
};

export default Navbar;
