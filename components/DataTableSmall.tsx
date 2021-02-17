import React, { useContext } from "react";
import { MyAppContext } from "../store";
import { useRouter } from "next/router";
import CashSVG from "./svgs/CashSVG";
import { CategoryIcon } from "./CategoryIcon";
import ChevRightSVG from "./svgs/ChevRightSVG";
import formatNumberToCurrency from "../lib/formatCurrency";
import TransactionType from "../types/TransactionType";
import Currency from "../types/Currency";
import { de } from "date-fns/locale";
import { format } from "date-fns";
import { DataTableProps } from "./DataTableBig";
import Link from "next/link";
import useDeleteTransaction from "../lib/useDeleteTransaction";

const DataTableSmall: React.FC<DataTableProps & { isDetailPage: boolean }> = ({
  transactions,
  setSkip,
  skip,
  limit,
  totalResults,
  showNav = true,
  columnData,
  isDetailPage = false,
  pageCount: controlledPageCount,
}) => {
  const router = useRouter();
  const { currency } = useContext(MyAppContext);
  const mutation = useDeleteTransaction();
  return (
    <>
      {transactions.length > 0 ? (
        <div className="sm:hidden px-4">
          <ul className="mt-2 divide-y divide-gray-200 overflow-hidden shadow sm:hidden">
            {transactions.map(({ _id, title, amount, date, type }) => (
              <li key={_id}>
                <Link href={`/transactions/${type.toLowerCase()}`}>
                  <a className="block px-4 py-4 bg-white hover:bg-gray-50">
                    <span className="flex items-center space-x-4">
                      <span className="flex-1 flex space-x-4 truncate">
                        <CashSVG />
                        <span className="flex flex-col text-gray-500 text-sm truncate">
                          <span className="truncate">{title}</span>
                          <span
                            className={`${
                              type == TransactionType.INCOME
                                ? "text-green-500"
                                : "text-red-500"
                            } font-medium`}
                          >
                            {type == TransactionType.INCOME ? "+" : "-"}
                            {formatNumberToCurrency(amount, currency)}
                          </span>
                          <span>
                            {format(new Date(date), "do LLL yyyy", {
                              locale: de,
                            })}
                          </span>
                        </span>
                      </span>
                      {isDetailPage ? (
                        <div className="space-x-1 px-2 py-4 flex items-center w-24">
                          <Link href={`/new?id=${_id}`}>
                          <a className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 w-8">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </a>
                          </Link>
                          <button 
                          onClick={()=>mutation.mutate(_id as any)}
                          className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 w-8">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <button className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-gray-300 hover:bg-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                          <ChevRightSVG />
                        </button>
                      )}
                    </span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
          {/* <nav
            className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200"
            aria-label="Pagination"
          >
             <div className="flex-1 flex justify-between">
              <button
                onClick={goToPrev}
                disabled={isFirstPage}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500"
              >
                Previous
              </button>
              <button
                onClick={goToNext}
                disabled={isLastPage}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500"
              >
                Next
              </button>
            </div> 
          </nav>*/}
        </div>
      ) : (
        <div className="mt-2 px-4">
          <p>No transactions yet to display</p>
        </div>
      )}
    </>
  );
};

export default DataTableSmall;
