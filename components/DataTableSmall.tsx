import React,{useContext} from 'react'
import { MyAppContext } from '../store';
import CashSVG from "./svgs/CashSVG";
import {CategoryIcon} from './CategoryIcon';
import ChevRightSVG from "./svgs/ChevRightSVG";
import {formatNumberToCurrency} from "../lib/formatCurrency"
import TransactionType from "../types/TransactionType";
import Currency from "../types/Currency"
import { de } from "date-fns/locale"; 
import {format  } from "date-fns";
import { DataTableProps } from './DataTableBig';

const DataTableSmall: React.FC<DataTableProps> = ({
  transactions,
  setPage,
  page,
}) => {
    const {currency}= useContext(MyAppContext)
  return (
    <>
      {transactions.length > 0 ? (
        <div className="shadow sm:hidden px-4">
          <ul className="mt-2 divide-y divide-gray-200 overflow-hidden shadow sm:hidden">
            {transactions.map(({ _id, title, amount, date, type }) => (
              <li key={_id}>
                <a
                  href="#"
                  className="block px-4 py-4 bg-white hover:bg-gray-50"
                >
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
                        <span>{format(new Date(date),"do LLL yyyy",{locale:de})}</span>
                      </span>
                    </span>
                    <ChevRightSVG test={(e) => console.log(e)} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <nav
            className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200"
            aria-label="Pagination"
          >
            <div className="flex-1 flex justify-between">
              <button
                onClick={() => setPage((old) => Math.max(old - 1, 0))}
                disabled={page === 0}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500"
              >
                Previous
              </button>
              <button
                // onClick={() => {
                //   data.hasMore ? setPage((old) => old + 1) : null;
                // }}
                // disabled={!data.hasMore}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500"
              >
                Next
              </button>
            </div>
          </nav>
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
