import React, { useContext } from "react";
import Link from "next/link";
import { Select } from "@chakra-ui/react";
import { Months, MyAppContext } from "../store";
type HeaderProps = {
  pageTitle?: string;
};
const Header: React.FC<HeaderProps> = ({
  pageTitle = "Please add new page title",
}) => {
  const actionButtons = ["New Item"];
  const {changeMonth} = useContext(MyAppContext);
  const selectMonth = (e)=>changeMonth(e.target.value);
  return (
    <div className="border-t border-gray-200 px-4 py-4 flex items-center justify-between sm:px-6 lg:px-8 bg-white">
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate">
          {pageTitle}
        </h1>
      </div>
      <div className="mt-1 flex sm:mt-0 sm:ml-4">
        <Select placeholder="Change Month" onChange={selectMonth}>
          {Months.map((month) => (
            <option value={month.code} key={month.code}>
              {month.name}
            </option>
          ))}
        </Select>
        {actionButtons.map((btn) => (
          <Link href="/new" key={btn}>
            <a className="order-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:order-1 sm:ml-3 flex-none">
              {btn}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default Header;
