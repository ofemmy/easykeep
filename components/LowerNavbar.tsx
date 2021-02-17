import Link from "next/link";
import React from "react";
import CardSVG from "./svgs/CardSVG";
import CashSVG from "./svgs/CashSVG";
import HomeSVG from "./svgs/HomeSVG";
import AddSVG from "./svgs/AddSVG";

const LowerNavbar = () => {
  return (
    <div className="lg:hidden mx-auto h-12 rounded-sm">
      <div className="fixed bg-gradient-to-br from-gray-300 shadow-lg inset-x-0 z-40 bottom-0 flex items-center justify-center">
        <div className="space-x-4 flex text-gray-700">
          <Link href="/">
            <a className="px-4 font-medium flex flex-col items-center justify-center py-2 hover:text-gray-100 hover:bg-blueGray-500">
              <span className="">
                <HomeSVG/>
              </span>
              <span className="text-xs">
              Home
              </span>
              
            </a>
          </Link>
         
          <Link href="/transactions/income">
            <a className="flex flex-col items-center justify-center px-4 text-xs font-medium hover:text-gray-100 hover:bg-blueGray-500">
              <span>
                <CashSVG/>
              </span>
              <span className="text-xs">
              Income
              </span>
              
            </a>
           </Link>
           <Link href="/transactions/expense">
            <a className="flex flex-col items-center justify-center px-4 text-xs font-medium hover:text-gray-100 hover:bg-blueGray-500">
              <span>
                <CardSVG/>
              </span>
              <span className="text-xs">
              Expenses
              </span>
              
            </a>
           </Link>
           <Link href="/new">
            <a className="flex flex-col items-center justify-center px-4 text-xs font-medium hover:text-gray-100 hover:bg-blueGray-500">
              <span>
                <AddSVG/>
              </span>
              <span className="text-xs">
              New Item
              </span>
            </a>
           </Link>
        </div>
      </div>
    </div>
  );
};

export default LowerNavbar;
