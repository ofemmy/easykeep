import React, { useEffect, useMemo,useContext } from "react";
import Currency from "../types/Currency";
import { ITransaction } from "../db/types/ITransaction";
import { useTable, usePagination } from "react-table";
import TableOptions from "./TableOptions";
import {MyAppContext} from "../store"
import Link from "next/link";
export type DataTableProps = {
  transactions: [ITransaction & { _id: string }];
  currency?: Currency;
  pageCount?: any;
  limit?: number;
  totalResults?: number;
  showNav?: boolean;
  columnData?: any;
  setSkip?:any;
  skip?:number
};
const DataTableBig: React.FC<DataTableProps> = ({
  transactions,
  setSkip,
  skip,
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
  const {month} = useContext(MyAppContext)
  useEffect(()=>{
  setSkip((pageIndex)*pageSize)
},[pageIndex])
  return (
    <div className="">
      <div className="max-w-6xl mx-auto px-4">
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
                            <TableOptions trxObject={row.original}/>
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
                        {/* (pageIndex+1)+limit */}
                        {canPreviousPage?(skip+1):1}
                      </span>
                      to
                      <span className="font-medium px-1">
                        {canNextPage?(skip+limit):totalResults}
                      </span>
                      of
                      <span className="font-medium px-1">{totalResults}</span>
                      results
                    </p>
                  </div>
                  <div className="flex-1 flex justify-between sm:justify-end mr-5">
                    <button
                      onClick={previousPage}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:text-gray-200"
                      disabled={!canPreviousPage}
                    >
                      Previous
                    </button>
                    <button
                      onClick={nextPage}
                      disabled={!canNextPage}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </nav>
              ) : null}
            </div>
          ) : (
            <div className="mt-2 flex flex-wrap items-center">
              <span>No transactions yet for {month.name}.</span>
              <span className="ml-5">
                <Link href="/new">
                <a href="" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Add your first Transaction
                </a>
                </Link>
                </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTableBig;
