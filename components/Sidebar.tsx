import React, { useState, useContext } from "react";
import Link from "next/link";
import SettingsSVG from "./svgs/SettingsSVG";
import HelpSVG from "./svgs/HelpSVG";
import { MyAppContext } from "../store";
import LogoutSVG from "./svgs/LogoutSVG";

type SidebarProps = {};
const Sidebar: React.FC<SidebarProps> = (props) => {
  const [activeLink, setActiveLink] = useState("Home");
  const { AppMainLinks } = useContext(MyAppContext);
  return (
    <div className="flex flex-col flex-grow bg-primary pt-5 pb-4 overflow-y-auto">
      <div className="flex items-center justify-center flex-shrink-0 px-4">
        <h2 className="text-2xl font-extrabold text-white sm:text-3xl sm:tracking-tight lg:text-4xl">
          geldTrack
        </h2>
      </div>
      <nav
        className="flex-1 flex flex-col divide-y divide-white overflow-y-auto mt-20"
        aria-label="Sidebar"
      >
        <div className="px-2 space-y-1">
          {Object.keys(AppMainLinks).map((linkItem) => (
            <Link href={`${AppMainLinks[linkItem].href}`} key={linkItem}>
              <a
                className={`group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-blue-100
                 hover:text-white hover:bg-[#60799c] ${
                   activeLink === linkItem ? "bg-[#60799c] text-white" : ""
                 }`}
                onClick={() => setActiveLink(linkItem)}
              >
                {AppMainLinks[linkItem].icon}
                {AppMainLinks[linkItem].name}
              </a>
            </Link>
          ))}
        </div>
        <div className="mt-6 pt-6">
          <div className="px-2 space-y-1">
            <Link href="/settings">
              <a className="group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-gray-100 hover:text-white hover:bg-[#60799c]">
                <SettingsSVG customClasses="mr-4" />
                Settings
              </a>
            </Link>
            <Link href="/logout">
              <a className="group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-gray-700 bg-white hover:text-white hover:bg-[#60799c]">
                <LogoutSVG customClasses="mr-4" />
                Logout
              </a>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
