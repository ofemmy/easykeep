import React, { useContext, useState } from "react";
import Header from "../components/Header";
import { capitalize } from "lodash";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useQuery } from "react-query";
import usePageLinks from "../lib/usePageLinks";
import ReportComponent from "../components/ReportComponent";
import { MyAppContext } from "../store";
import { TransactionType } from "@prisma/client";
export default withPageAuthRequired(function Report() {
  const { month } = useContext(MyAppContext);
  const { pageLinks, activeLink, setActiveLink } = usePageLinks(
    ["income", "expense"],
    "income"
  );

  // const fetchReport = async ({ queryKey }) => {
  //   const [_, month, activeLink] = queryKey;
  //   const trxType =
  //     activeLink === "income"
  //       ? TransactionType.Income
  //       : TransactionType.Expense;
  //   const { data } = await axios.post(`/api/transactions/report`, {
  //     trxType,
  //     fromDate: new Date(),
  //     toDate: new Date(),
  //   });
  //   return data;
  // };
  // const queryResult = useQuery(
  //   ["report", month.code, activeLink],
  //   fetchReport,
  //   { staleTime: 1000 * 60 * 30 }
  // );
  return (
    <>
      <Header pageTitle="Report" />
      <div className="max-6xl mx-auto border-t border-gray-200">
        <div className="mt-4 px-4 sm:px-6">
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">
              Select a tab
            </label>
            <select
              id="tabs"
              name="tabs"
              className="block w-full focus:ring-indigo-500 focus:border-gray-500 border-gray-300 rounded-md p-2"
            >
              <option selected>Income</option>
              <option>Expense</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <nav
              className="relative z-0 rounded-lg shadow flex divide-x divide-gray-200"
              aria-label="Tabs"
            >
              {pageLinks.map((link, i) => (
                <a
                  href="#"
                  aria-current={activeLink === link}
                  key={link}
                  onClick={() => setActiveLink(link)}
                  className={`focus-within:text-gray-900 ${
                    activeLink === link ? "bg-white" : ""
                  }  group relative min-w-0 flex-1 overflow-hidden py-4 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10`}
                >
                  <span>{link.toUpperCase()}</span>
                  <span
                    aria-hidden="true"
                    className={`${
                      activeLink === link ? "bg-yellow-500" : "bg-transparent"
                    } absolute inset-x-0 bottom-0 h-0.5`}
                  ></span>
                </a>
              ))}
            </nav>
          </div>
          <div className="mt-8">
            <ReportComponent month={month} active={activeLink} />
          </div>
        </div>
      </div>
    </>
  );
});
