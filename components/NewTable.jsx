import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useTable, usePagination } from "react-table";

const NewTable = ({cols,data,pageCount:controlledPageCount,setSkip}) => {
   
const col1=useMemo(()=>cols,[])

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
    { data, columns:col1, manualPagination: true,initialState:{pageSize:5}, pageCount:controlledPageCount },
    usePagination
  );
  useEffect(()=>{
      console.log("this is running")
    setSkip((pageIndex)*pageSize)
  },[pageIndex])
//   const goToNext = ()=>{
//       nextPage();
//       setSkip((pageIndex+1)*pageSize)
//   }

  return (
    <>
    <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
            },
            null,
            2
          )}
        </code>
      </pre>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex justify-end items-end mr-10">
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={nextPage} disabled={!canNextPage}>
          {">"}
        </button>{" "}
      </div>
    </>
  );
};

async function getTrxList(limit,skip) {
    const res = await axios.get(`/api/test?limit=${limit}&skip=${skip}`);
    return res.data;
  }

export default NewTable;
