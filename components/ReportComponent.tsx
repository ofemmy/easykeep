import React, { useState } from "react";
import { DateTime } from "luxon";
import { useDisclosure } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { TransactionType } from "@prisma/client";
import Calender from "./Calender";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import useProfile from "../lib/useProfile";
import CalenderSVG from "./svgs/CalenderSVG";
import formatNumberToCurrency from "../lib/formatCurrency";
import axios from "axios";
import ChevRightSVG from "./svgs/ChevRightSVG";
import SectionHeading from "./SectionHeading";
import { ResponsivePie } from "@nivo/pie";
export default function ReportComponent({ month, active }) {
  const { isOpen: isCalFromOpen, onToggle: onCalFromToggle } = useDisclosure();
  const { isOpen: isCalToOpen, onToggle: onCalToToggle } = useDisclosure();
  const [fromDate, setFromDate] = useState(DateTime.utc());
  const [toDate, setToDate] = useState(DateTime.utc().plus({ months: 1 }));
  const typeColor = active === "income" ? "green" : "red";
  const fetchReport = async ({ queryKey }) => {
    const [_, month, active] = queryKey;
    const trxType =
      active === "income" ? TransactionType.Income : TransactionType.Expense;
    const { data } = await axios.get(
      `/api/transactions/report?month=${month}&type=${trxType}`
    );
    return data;
  };
  const {
    userProfile,
    isProfileLoading,
    isProfileError,
    profileError,
  } = useProfile();
  const { data, isLoading, isError, error } = useQuery(
    ["report", month.code, active],
    fetchReport,
    { staleTime: 1000 * 60 * 30 }
  );
  if (isLoading || isProfileLoading) {
    return <span>Loading....</span>;
  }
  if (isError || isProfileError) {
    return <span>Error: {error}</span>;
  }
  const { result } = data;
  const { currency } = userProfile.profile;
  // const pieData = result.map((obj, i) => ({
  //   id: i + 1,
  //   label: obj.category,
  //   value: obj.sum,
  // }));
  const selectDateHandler = (...args: [string, DateTime]) => {
    const [field, date] = args;
    if (field === "fromDate") {
      setFromDate(date);
    } else if (field === "toDate") {
      setToDate(date);
    }
  };
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="">
          <button
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 
            hover:bg-gray-700  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            {`${month.name} ${DateTime.now().year}`}
          </button>
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
                  value={fromDate.toISODate()}
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
                  value={toDate.toISODate()}
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
              className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600
            hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>
      <SectionHeading text="Categories" customClasses="my-4" />
      <div className="flex">
        <div className="w-1/2 bg-white rounded-md shadow-sm h-screen overflow-hidden">
          {/* <ul className="divide-y divide-gray-200"> */}
          <Accordion allowToggle overflow="hidden">
            {result
              .sort((a, b) => a.sum - b.sum)
              .map(({ category, sum }) => (
                <AccordionItem key={category}>
                  <h2>
                    <AccordionButton _focus={{ outline: "none" }} py={4}>
                      <div className="flex-1 flex items-center min-w-0 justify-between text-gray-600">
                        <div>
                          <p className="text-sm font-medium truncate uppercase">
                            {category}
                          </p>
                        </div>
                        <div className="hidden md:flex flex-1 justify-end items-center">
                          <div className="flex flex-col items-end justify-center">
                            <p className="text-sm font-medium">
                              {formatNumberToCurrency(sum, currency)}
                            </p>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-${typeColor}-900 bg-${typeColor}-200`}
                            >
                              <p className={`text-${typeColor}-900`}>35%</p>
                            </span>
                          </div>
                        </div>
                      </div>
                      <AccordionIcon ml={8} />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </AccordionPanel>
                </AccordionItem>

                // <li
                //   key={category}
                //   className="hover:bg-gray-50 text-gray-600 odd:bg-gray-50 cursor-pointer"
                // >
                //   <div className="hover:text-yellow-500">
                //     <div className="flex items-center px-4 py-4 sm:px-6">
                //       <div className="min-w-0 flex-1 flex items-center justify-between">
                //         <div>
                //           <p className="text-sm font-medium truncate uppercase">
                //             {category}
                //           </p>
                //         </div>
                //         <div className="hidden md:flex flex-1 justify-end items-center">
                //           <div className="flex flex-col items-end justify-center">
                //             <p className="text-sm font-medium">
                //               {formatNumberToCurrency(sum, currency)}
                //             </p>
                //             <span
                //               className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-${typeColor}-900 bg-${typeColor}-200`}
                //             >
                //               <p className={`text-${typeColor}-900`}>35%</p>
                //             </span>
                //           </div>
                //           <div className="text-gray-500 ml-8">
                //             <ChevRightSVG className="" />
                //           </div>
                //         </div>
                //       </div>
                //     </div>
                //   </div>
                //   <div className="flex items-center px-4 py-4 sm:px-6 bg-white">
                //     Hey there
                //   </div>
                // </li>
              ))}
          </Accordion>
        </div>
        <div className="w-1/2 bg-white rounded-md shadow-sm h-screen border-l-2 border-gray-100 py-4 ml-4">
          <div className="h-80 w-full">
            {/* <ResponsivePie
              data={pieData}
              colors={{ scheme: "category10" }}
              innerRadius={0.4}
              legends={[
                {
                  anchor: "bottom",
                  direction: "row",
                  itemWidth: 100,
                  itemHeight: 12,
                },
              ]}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
