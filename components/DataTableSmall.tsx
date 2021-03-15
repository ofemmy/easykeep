import React, { useContext } from "react";
import { MyAppContext } from "../store";
import { useRouter } from "next/router";
import CashSVG from "./svgs/CashSVG";
import { CategoryIcon } from "./CategoryIcon";
import ChevRightSVG from "./svgs/ChevRightSVG";
import formatNumberToCurrency from "../lib/formatCurrency";
import { TransactionType } from "@prisma/client";
import Currency from "../types/Currency";
import { DateTime } from "luxon";
import { DataTableProps } from "./DataTableBig";
import Link from "next/link";
import useDeleteTransaction from "../lib/useDeleteTransaction";
import TableOptions from "./TableOptions";
import EditSVG from "./svgs/EditSVG";
import DeleteSVG from "./DeleteSVG";

const DataTableSmall: React.FC<DataTableProps & { isDetailPage: boolean,currency:string }> = ({
  transactions,
  setSkip,
  skip,
  limit,
  totalResults,
  showNav = true,
  columnData,
  isDetailPage = false,
  pageCount: controlledPageCount,
  currency

}) => {
  const router = useRouter();
  // const { currency } = useContext(MyAppContext);
  const mutation = useDeleteTransaction();
  return (
    <>
      {transactions.length > 0 ? (
        <div className="sm:hidden px-4">
          <ul className="mt-2 divide-y divide-gray-200 overflow-hidden shadow sm:hidden">
            {transactions.map((trx) => (
              <li key={trx.id}>
                <Link href={`/transactions/${trx.type.toLowerCase()}`}>
                  <a className="block px-4 py-4 bg-white hover:bg-gray-50">
                    <span className="flex items-center space-x-4">
                      <span className="flex-1 flex space-x-4 truncate">
                        <CashSVG customClasses="text-gray-500" />
                        <span className="flex flex-col text-gray-500 text-sm truncate">
                          <span className="truncate">{trx.title}</span>
                          <span
                            className={`${
                              trx.type == TransactionType.Income
                                ? "text-green-500"
                                : "text-red-500"
                            } font-medium`}
                          >
                            {trx.type == TransactionType.Income ? "+" : "-"}
                            {formatNumberToCurrency(
                              (trx.amount as never) as number,
                              currency
                            )}
                          </span>
                          <span>
                            {/* todo use correct date */}
                            {DateTime.fromJSDate(new Date(trx.entryDate)).toFormat('yyyy.LL.dd')}
                          </span>
                        </span>
                      </span>
                      {isDetailPage ? (
                        <div className="space-x-2 px-2 py-4 flex items-center justify-center">
                          <button className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                            <EditSVG />
                          </button>
                          <button
                            onClick={() => mutation.mutate(trx.id as any)}
                            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <DeleteSVG />{" "}
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
