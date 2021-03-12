import { useContext } from "react";
import Header from "../components/Header";
import EditSVG from "../components/svgs/EditSVG";

import { MyAppContext } from "../store";
export default function Settings() {
  const { language, currency } = useContext(MyAppContext);
  return (
    <div className="max-6xl mx-auto border-t border-gray-200">
      <Header pageTitle={"Settings"} />
      <div className="px-8 mt-5">
        <div className="bg-white rounded-md shadow-sm w-full p-4">
          <h2 className="text-sm font-semibold tracking-wide uppercase p-2 inline-block rounded-md text-gray-600">
            Current settings
          </h2>
          <div>
            <ul className="grid grid-cols-1 gap-4 sm:gap-6 sm-grid-cols-2 xl:grid-cols-3 mt-3">
              <li className="col-span-1 relative flex shadow-sm rounded-md flex-col bg-yellow-100 p-2 text-yellow-600 justify-center items-center">
                <span>Currency</span>
                <span>{currency}</span>
                <button className="bg-yellow-300 p-1 rounded-md absolute right-1.5 top-1.5">
                <EditSVG />
                </button>
              </li>
              <li className="col-span-1 flex relative flex-col shadow-sm rounded-md bg-blue-100 p-2 text-blue-600 justify-center items-center">
                <span>Language</span>
                <span>{language}</span>
                <button className="bg-blue-300 p-1 rounded-md absolute right-1.5 top-1.5">
                <EditSVG />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
