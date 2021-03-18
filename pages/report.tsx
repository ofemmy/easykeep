import React, { useContext, useState } from "react";
import Header from "../components/Header";
import { capitalize } from "lodash";
import { useQuery } from "react-query";
import usePageLinks from "../lib/usePageLinks";
import ReportComponent from "../components/ReportComponent";
import { MyAppContext } from "../store";
import { TransactionType } from "@prisma/client";
import axios from "axios";
export default function Report() {
  const { month } = useContext(MyAppContext);
  const { pageLinks, activeLink, setActiveLink } = usePageLinks(
    ["income", "expense"],
    "income"
  );

  const fetchReport = async ({ queryKey }) => {
    const [_, month, activeLink] = queryKey;
    const trxType =
      activeLink === "income"
        ? TransactionType.Income
        : TransactionType.Expense;
    const { data } = await axios.get(
      `/api/transactions/report?month=${month}&type=${trxType}`
    );
    return data;
  };
  const queryResult = useQuery(
    ["report", month.code, activeLink],
    fetchReport,
    { staleTime: 1000 * 60 * 30 }
  );
  return (
    <>
      <Header pageTitle="Report" />
      <div className="max-6xl mx-auto border-t border-gray-200">
        <div className="px-4 sm:px-6 md:px-0">
          <div className="py-6">
            <div className="sm:hidden"></div>
            <div className="hidden sm:block px-10">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex">
                  {pageLinks.map((link, i) => (
                    <button
                      key={link}
                      onClick={() => setActiveLink(link)}
                      className={`${
                        activeLink == link
                          ? "border-yellow-500 text-yellow-600"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        i == 0 ? "ml-0" : "ml-8"
                      }`}
                    >
                      {link.toUpperCase()}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="mt-4">
                <ReportComponent month={month} active={activeLink} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
