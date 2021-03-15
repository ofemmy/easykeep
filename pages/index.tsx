import dynamic from "next/dynamic";
import React, { useContext, useEffect } from "react";
import Link from "next/link";
import Header from "../components/Header";
import withSession from "../lib/withSession";
import formatNumberToCurrency from "../lib/formatCurrency";
import CardSVG from "../components/svgs/CardSVG";
import ScaleSVG from "../components/svgs/ScaleSVG";
import Card from "../components/Card";
import { MyAppContext } from "../store";
import { format } from "date-fns";
import { Skeleton } from "@chakra-ui/react";
import { useQuery } from "react-query";
import axios from "axios";
import { withPageAuthRequired, useUser } from "@auth0/nextjs-auth0";
import IndexPieWidget from "../components/IndexPieWidget";
import useWindowWidth from "../lib/useWindowWidth";
import TitleComponent from "../components/TitleComponent";
import AmountComponent from "../components/AmountComponent";
import CategoryComponent from "../components/CategoryComponent";
import {
  fetchRecentTransactions,
  fetchSum,
  fetchTransactions,
} from "../db/queries";
import { DateTime } from "luxon";
import useProfile from "../lib/useProfile";

const DataTableBig = dynamic(() => import("../components/DataTableBig"));
const DataTableSmall = dynamic(() => import("../components/DataTableSmall"));
export const columns = [
  {
    Header: "Title",
    accessor: "title",
    Cell: ({ value, row }) => <TitleComponent value={value} />,
  },
  {
    Header: "Amount",
    accessor: "amount",
    Cell: ({ value, row }) => (
      <AmountComponent value={value} obj={row.original} />
    ),
  },
  {
    Header: "Date",
    accessor: (row) => DateTime.fromISO(row.entryDate).toISODate(), // TODO:date
  },
  {
    Header: "Category",
    accessor: "category",
    Cell: ({ value }) => <CategoryComponent value={value} />,
  },
];
const getTransactions = async (config) => {
  const { month, skip, limit } = config;
  const res = await axios.get(
    `/api/transactions?month=${month}&limit=${limit}`
  );

  return res.data;
};

export default withPageAuthRequired(function Home() {
  const screenWidthMatched = useWindowWidth("sm");
  const { setUser, month, setSidebarOpen, AppMainLinks } = useContext(
    MyAppContext
  );

  useEffect(() => {
    setSidebarOpen(false);
  }, []);
  const { data, isLoading, isError, error } = useQuery(
    ["transactions", month],
    () => getTransactions({ month: month.code, limit: 4 }),
    { keepPreviousData: true }
  );
  const {
    userProfile,
    isProfileLoading,
    isProfileError,
    profileError,
  } = useProfile();
  if (isLoading || isProfileLoading) {
    return <span>Loading....</span>;
  }
  if (isError || isProfileError) {
    return <span>Error: {profileError}</span>;
  }

  const { summary, transactions } = data.data;
  const { currency } = userProfile.profile;
  return (
    <>
      <Header pageTitle="Home" />
      {isLoading ? (
        <div className="max-6xl mx-auto px-4 mt-5">
          <Skeleton height="250px" />
        </div>
      ) : isError ? (
        <p>Error fetching data please reload</p>
      ) : (
        <div className="flex justify-between max-6xl mx-auto px-8 mt-8">
          <div className="bg-white shadow-sm rounded-md h-64 w-7/12 p-5">
            <h2 className="text-sm font-semibold text-gray-500 tracking-wide uppercase">
              Summary &#8226; {month.name}
            </h2>
            <div className="mt-2 space-y-3 ">
              <div className="flex bg-green-100 p-5 rounded-md text-green-500">
                <div className="flex-shrink-0">
                  <ScaleSVG />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-green-500 truncate">
                      Total Income
                    </dt>
                    <dd className="text-lg font-medium text-green-500">
                      {formatNumberToCurrency(summary.totalIncome, currency)}
                    </dd>
                  </dl>
                </div>
                <div>
                  <Link href={AppMainLinks.incomes.href}>
                    <a className="uppercase text-xs p-2 bg-green-200 rounded-sm hover:text-white hover:bg-green-300">
                      View all
                    </a>
                  </Link>
                </div>
              </div>
              <div className="flex bg-red-100 p-5 rounded-md">
                <div className="flex-shrink-0 text-red-500">
                  <CardSVG />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-red-500 truncate">
                      Total Expenses
                    </dt>
                    <dd className="text-lg font-medium text-red-500">
                      {formatNumberToCurrency(summary.totalExpense, currency)}
                    </dd>
                  </dl>
                </div>
                <div>
                  <Link href={AppMainLinks.expenses.href}>
                    <a className="uppercase text-xs p-2 bg-red-200 text-red-500 rounded-sm hover:text-white hover:bg-red-300">
                      View all
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-sm rounded-md h-64 ml-4 w-5/12 py-4 px-2">
            <IndexPieWidget currency={currency} summary={summary} />
          </div>
        </div>
        // <Dashboard summary={summary} />
      )}
      <h2 className="max-w-6xl mx-auto mt-8 px-4 text-lg leading-6 font-medium text-gray-900">
        Recent transactions
      </h2>

      {screenWidthMatched ? (
        <DataTableBig
          transactions={transactions}
          columnData={columns}
          showNav={false}
        />
      ) : (
        <DataTableSmall
          transactions={transactions}
          isDetailPage={false}
          currency={currency}
        />
      )}
      <div className="mt-16"></div>
    </>
  );
});
// export const getServerSideProps = withPageAuthRequired({
//   async getServerSideProps({ req, res }) {
//     const { user } = getSession(req, res);
//     const today = DateTime.utc();
//     const ownerId = user.sub;
//     const requestOptions = {
//       limit: 4,
//       ownerId,
//       date: today,
//     };
//     const trxList = await fetchTransactions(requestOptions);
//     const summary = await fetchSum({ ownerId, date: today });

//     const result = {
//       msg: "success",
//       data: { transactions: trxList, summary },
//     };
//     const pageData = JSON.parse(JSON.stringify(result));
//     return {
//       props: { pageData },
//     };
//   },
// });
// export const getServerSideProps = withSession(async function ({ req, res }) {
//   const user = req.session.get("user");
//   if (!user) {
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };
//   }
//   const today = DateTime.utc();
//   const requestOptions = {
//     limit: 4,
//     ownerId: user.id,
//     date: today,
//   };
//   const trxList = await fetchTransactions(requestOptions);
//   const summary = await fetchSum({ ownerId: user.id, date: today });

//   const result = {
//     msg: "success",
//     data: { transactions: trxList, summary },
//   };
//   const pageData = JSON.parse(JSON.stringify(result));
//   return {
//     props: { user, pageData },
//   };
// });
