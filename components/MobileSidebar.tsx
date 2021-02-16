import { Transition } from "@headlessui/react";
import React, { useState,useContext } from "react";
import CloseSVG from "./svgs/CloseSVG";
import Link from "next/link";
import SettingsSVG from "./svgs/SettingsSVG";
import HelpSVG from "./svgs/HelpSVG";
import HomeSVG from "./svgs/HomeSVG";
import ScaleSVG from "./svgs/ScaleSVG";
import CardSVG from "./svgs/CardSVG";
import DocumentSVG from "./svgs/DocumentSVG";
import { MyAppContext } from "../store";
export type MenuItem = {
  href: string;
  name: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
};
const MobileSidebar = () => {
  const {isSidebarOpen,setSidebarOpen} = useContext(MyAppContext)
  const [activeLink, setActiveLink] = useState("Home");
  const links: MenuItem[] = [
    { href: "/", name: "Home", icon: HomeSVG },
    { href: "/transactions/income", name: "Incomes", icon: ScaleSVG },
    { href: "/transactions/expense", name: "Expenses", icon: CardSVG },
    { href: "/report", name: "Reports", icon: DocumentSVG },
  ];
  return (
    <div className={`${isSidebarOpen?"block":"hidden"}`}>
      <div className="fixed inset-0 z-40 flex">
        <Transition
          show={isSidebarOpen}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {(ref) => (
            <div className="fixed inset-0" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
            </div>
          )}
        </Transition>

        <Transition
          show={isSidebarOpen}
          enter="transition ease-in-out duration-300 transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          {(ref) => (
            <div className="relative max-w-xs w-64 pt-5 pb-4 flex-1 flex flex-col bg-gray-800 min-h-screen">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={()=>setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <CloseSVG />
                </button>
              </div>
              <div className="flex-shrink-0 px-4 flex items-center justify-start">
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl sm:tracking-tight lg:text-4xl">cashtrack</h2>
              </div>
              <div className="mt-5 flex-1 h-0 overflow-y-auto">
                <nav className="px-2 space-y-1">
                  {links.map(({ href, name, icon }) => (
                    <Link href={`${href}`} key={name}>
                      <a
                        href=""
                        className={`group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-blue-100
                 hover:text-white hover:bg-gray-600 ${
                   activeLink === name ? "bg-gray-600 text-white" : ""
                 }`}
                        onClick={() => setActiveLink(name)}
                      >
                        {icon(null)}
                        {name}
                      </a>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          )}
        </Transition>
        <div className="flex-shrink-0 w-14"></div>
      </div>
    </div>
  );
};

export default MobileSidebar;
