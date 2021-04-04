import React, { useState, useRef } from "react";
import { DateTime } from "luxon";
import {
  calculateSum,
  getLowestAndHighestCategory,
  calculateLowestAndHighestValue,
} from "../lib/reportHandler";
import { useDisclosure } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { Transaction, TransactionType } from "@prisma/client";
import Calender from "./Calender";

import CalenderSVG from "./svgs/CalenderSVG";

import axios from "axios";
import ChevRightSVG from "./svgs/ChevRightSVG";
import SectionHeading from "./SectionHeading";
import { ResponsivePie } from "@nivo/pie";
import { ReportPanel } from "./ReportPanel";
export default function ReportComponent({ month, active }) {
  const { isOpen: isCalFromOpen, onToggle: onCalFromToggle } = useDisclosure();
  const { isOpen: isCalToOpen, onToggle: onCalToToggle } = useDisclosure();
  const [fromDate, setFromDate] = useState(
    DateTime.utc().minus({ months: 6 }).startOf("month")
  );
  const [toDate, setToDate] = useState(DateTime.utc().endOf("month"));
  const fromDateRef = useRef(
    DateTime.utc().minus({ months: 6 }).startOf("month")
  );
  const toDateRef = useRef(DateTime.utc().endOf("month"));
  const fetchReport = async ({ queryKey }) => {
    const [_, fromDate, toDate, active] = queryKey;
    const trxType =
      active === "income" ? TransactionType.Income : TransactionType.Expense;
    const { data } = await axios.post("/api/transactions/report", {
      trxType,
      fromDate,
      toDate,
    });
    return data;
  };
  const queryObj = useQuery(["report", fromDate, toDate, active], fetchReport, {
    staleTime: 1000 * 60 * 30,
  });
  const selectDateHandler = (...args: [string, DateTime]) => {
    const [field, date] = args;
    if (field === "fromDate") {
      fromDateRef.current = date;
    } else if (field === "toDate") {
      toDateRef.current = date;
    }
  };
  function generateReport() {
    setFromDate(fromDateRef.current);
    setToDate(toDateRef.current);
    //queryObj.refetch();
  }
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="">
          <h2
            className={`text-sm font-semibold tracking-wide uppercase p-2 inline-block rounded-md text-yellow-600`}
          >
            {`${month.name} ${DateTime.now().year}`}
          </h2>
        </div>
        <div className="flex items-center justify-end flex-1">
          <div className="flex items-center">
            <label
              htmlFor="fromDate"
              className="text-sm font-medium text-gray-500"
            >
              From
            </label>
            <div className="flex items-center ml-4">
              <div className="relative rounded-md shadow-sm border ">
                <input
                  id="fromDate"
                  type="text"
                  name="fromDate"
                  placeholder="DD.MM.YYYY"
                  className="border-gray-300
              focus:ring-blue-500 focus:border-blue-500 block w-full pl-2 pr-12 sm:text-sm  rounded-md"
                  onClick={onCalFromToggle}
                  value={fromDateRef.current.toISODate()}
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={onCalFromToggle}
                >
                  <span className="text-gray-500 hover:text-blue-500 sm:text-sm cursor-pointer">
                    <CalenderSVG customClasses="cursor-pointer" />
                  </span>
                </div>
                {isCalFromOpen && (
                  <div className="absolute z-30 mt-1">
                    <Calender
                      date={DateTime.utc()}
                      clickHandler={selectDateHandler}
                      toggleCalendar={onCalFromToggle}
                      field="fromDate"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center ml-6">
            <label
              htmlFor="toDate"
              className="text-sm font-medium text-gray-500"
            >
              To
            </label>
            <div className="flex items-center ml-4">
              <div className="relative rounded-md shadow-sm border ">
                <input
                  id="toDate"
                  type="text"
                  name="toDate"
                  placeholder="DD.MM.YYYY"
                  className="border-gray-300
              focus:ring-blue-500 focus:border-blue-500 block w-full pl-2 pr-12 sm:text-sm  rounded-md"
                  onClick={onCalToToggle}
                  value={toDateRef.current.toISODate()}
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={onCalToToggle}
                >
                  <span className="text-gray-500 hover:text-blue-500 sm:text-sm cursor-pointer">
                    <CalenderSVG customClasses="cursor-pointer" />
                  </span>
                </div>
                {isCalToOpen && (
                  <div className="absolute z-30 mt-1">
                    <Calender
                      date={DateTime.utc()}
                      clickHandler={selectDateHandler}
                      toggleCalendar={onCalToToggle}
                      field="toDate"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <button
              onClick={generateReport}
              className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600
            hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>
      <SectionHeading
        text="Categories"
        customClasses="my-4"
        subText="Click on category name to see transactions under each category"
      />
      <ReportPanel active={active} queryObject={queryObj} />
    </div>
  );
}
