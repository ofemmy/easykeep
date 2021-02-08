import React from "react";
import Link from "next/link";
import SettingsSVG from "./svgs/SettingsSVG";
import HelpSVG from "./svgs/HelpSVG";
import HomeSVG from "./svgs/HomeSVG";
import ScaleSVG from "./svgs/ScaleSVG";
import CardSVG from "./svgs/CardSVG";
import DocumentSVG from "./svgs/DocumentSVG";
export type MenuItem = {
  href: string;
  name: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
};
type SidebarProps = {
};
const Sidebar: React.FC<SidebarProps> = (props) => {
  const links:MenuItem[] = [
    {href:"/",name:"Home",icon:HomeSVG },
    {href:"/income",name:"Incomes",icon:ScaleSVG},
    {href:"/expense",name:"Expenses",icon:CardSVG},
    {href:"/report",name:"Reports",icon:DocumentSVG}

  ]
  return (
    <div className="flex flex-col flex-grow bg-blue-700 pt-5 pb-4 overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4">
        <img
          className="h-8 w-auto"
          src="https://tailwindui.com/img/logos/easywire-logo-cyan-300-mark-white-text.svg"
          alt="Easywire logo"
        />
      </div>
      <nav
        className="flex-1 flex flex-col divide-y divide-white overflow-y-auto mt-20"
        aria-label="Sidebar"
      >
        <div className="px-2 space-y-1">
          {links.map(({ href, name,icon }) => (
            <Link href={`${href}`}
            key={name}
        >
             <a
                href=""
                className="group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-blue-100 hover:text-white hover:bg-blue-600"
                
              >
                {icon(null)}
                {name}
              </a> 
            </Link>
          ))}
        </div>
        <div className="mt-6 pt-6">
          <div className="px-2 space-y-1">
            <a
              href="#"
              className="group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-gray-100 hover:text-white hover:bg-blue-600"
            >
              <SettingsSVG />
              Settings
            </a>

            <a
              href="#"
              className="group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-gray-100 hover:text-white hover:bg-blue-600"
            >
              <HelpSVG />
              Help
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
