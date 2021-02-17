import React,{ useState} from "react";
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
  icon?: any;
};
type SidebarProps = {
};
const Sidebar: React.FC<SidebarProps> = (props) => {
  const [activeLink, setActiveLink] = useState("Home")
  const links:MenuItem[] = [
    {href:"/",name:"Home",icon:<HomeSVG customClasses="mr-4"/> },
    {href:"/transactions/income",name:"Incomes",icon:<ScaleSVG customClasses="mr-4"/>},
    {href:"/transactions/expense",name:"Expenses",icon:<CardSVG customClasses="mr-4"/>},
    {href:"/",name:"Reports",icon:<DocumentSVG customClasses="mr-4"/>}

  ]
  return (
    <div className="flex flex-col flex-grow bg-gray-800 pt-5 pb-4 overflow-y-auto">
      <div className="flex items-center justify-start flex-shrink-0 px-4">
        <h2 className="text-2xl font-extrabold text-white sm:text-3xl sm:tracking-tight lg:text-4xl">geldTrack</h2>
        {/* <img
          className="h-8 w-auto"
          src="https://tailwindui.com/img/logos/easywire-logo-cyan-300-mark-white-text.svg"
          alt="Easywire logo"
        /> */}
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
                className={`group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-blue-100
                 hover:text-white hover:bg-gray-600 ${activeLink===name?'bg-gray-600 text-white':''}`}
                onClick={()=>setActiveLink(name)}
                
              >
                {icon}
                {name}
              </a> 
            </Link>
          ))}
        </div>
        <div className="mt-6 pt-6">
          <div className="px-2 space-y-1">
            <a
              href="#"
              className="group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-gray-100 hover:text-white hover:bg-gray-600"
            >
              <SettingsSVG customClasses="mr-4"/>
              Settings
            </a>

            <a
              href="#"
              className="group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-gray-100 hover:text-white hover:bg-gray-600"
            >
              <HelpSVG customClasses="mr-4"/>
              Help
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
