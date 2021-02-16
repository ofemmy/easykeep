import Link from "next/link";
import React from "react";

const LowerNavbar = () => {
  return (
    <div className="lg:hidden mx-auto">
      <div className="fixed bg-gray-900 inset-x-0 z-40 bottom-0 flex items-center justify-center py-4">
        <div className="space-x-4">
          <Link href="/">
            <a className="bg-gray-900 text-white px-3 rounded-md text-sm font-medium">
              Home
            </a>
          </Link>
          <Link href="/transactions/income">
            <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Income
            </a>
          </Link>
          <Link href="/transactions/expense">
            <a
              href="#"
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Expenses
            </a>
          </Link>
          <Link href="/new">
            <a
              href="#"
              className="bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Add New Item
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LowerNavbar;
