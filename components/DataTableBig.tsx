import React, { useEffect, useMemo } from "react";
import { MyAppContext } from "../store";
import CashSVG from "./svgs/CashSVG";
import { CategoryIcon } from "./CategoryIcon";
import ChevRightSVG from "./svgs/ChevRightSVG";
import formatNumberToCurrency from "../lib/formatCurrency";
import TransactionType from "../types/TransactionType";
import Currency from "../types/Currency";
import { de } from "date-fns/locale";
import { format } from "date-fns";
import { ITransaction } from "../db/types/ITransaction";
import { useTable, usePagination } from "react-table";
import TableOptions from "./TableOptions";
export type DataTableProps = {
  transactions: [ITransaction & { _id: string }];
  currency?: Currency;
  pageCount?: any;
  limit?: number;
  totalResults?: number;
  showNav?: boolean;
  columnData?: any;
  setSkip?:any
};
const DataTableBig: React.FC<DataTableProps> = ({
  transactions,
  setSkip,
  limit,
  totalResults,
  showNav = true,
  columnData,
  pageCount:controlledPageCount
}) => {
  const columns = useMemo(() => columnData, []);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: transactions,
      initialState:{pageSize:limit,hiddenColumns:["type"]},
      pageCount: controlledPageCount,
      manualPagination: true,
    },
    usePagination
  );
  useEffect(()=>{
  setSkip((pageIndex)*pageSize)
},[pageIndex])
  return (
    <div className="">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col mt-2">
          {transactions.length > 0 ? (
            <div className="align-middle min-w-full overflow-x-auto shadow overflow-hidden sm:rounded-lg">
              <table
                className="min-w-full divide-y divide-gray-200"
                {...getTableProps()}
              >
                <thead className="bg-gray-50">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps()}
                          scope="col"
                          className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {column.render("Header")}
                        </th>
                      ))}
                      <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
                    </tr>
                  ))}
                </thead>
                <tbody
                  {...getTableBodyProps()}
                  className="divide-y divide-gray-200"
                >
                  {page.map((row, i) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()} className="bg-white odd:bg-gray-100">
                        {row.cells.map((cell) => {
                          return (
        
                            <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                              {cell.render("Cell")}
                            </td>
                            
                          
                          );
                        })}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <TableOptions/>
                          </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {showNav ? (
                <nav
                  className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
                  aria-label="Pagination"
                >
                  <div className="hidden sm:block ">
                    <p className="text-sm text-gray-700">
                      Showing
                      <span className="font-medium px-1">
                        {1}
                      </span>
                      to
                      <span className="font-medium px-1">
                        {"x"}
                      </span>
                      of
                      <span className="font-medium px-1">{totalResults}</span>
                      results
                    </p>
                  </div>
                  <div className="flex-1 flex justify-between sm:justify-end mr-5">
                    <button
                      onClick={previousPage}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      disabled={!canPreviousPage}
                    >
                      Previous
                    </button>
                    <button
                      onClick={nextPage}
                      disabled={!canNextPage}
                      // disabled={!data.hasMore}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </nav>
              ) : null}
            </div>
          ) : (
            <div className="mt-2">
              <p>No transactions yet to display</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTableBig;
